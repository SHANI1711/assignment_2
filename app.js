const express = require("express");
const fs = require("fs");
const AWS = require("aws-sdk");
const axios = require("axios");
const port = 5000;
var app = express();
app.use(express.json());

AWS.config.update({
	region: "us-east-1",
	accessKeyId: "ASIAUCVPND4H5P777PV5",
	secretAccessKey: "mAt58ze6CnF0jk2zx6jgzFbW/X7UNGu3Z93AESbp",
	sessionToken:
		"FwoGZXIvYXdzEID//////////wEaDEnKjLzJB5W6XKBhlSLAAX9chiEbAbGbZXIC1ijEzL5kRYappjPbuW/RxFpVWS464ThJzS4q8cJsrFp4FOgRUwg8RoEcttMLo7CUfLhmxEIogMJUnqI90CJdKF1q5e9rWFKmT/hb5EH5Mp/6HinIHZi/Cp/pEdL6INtUDC3eeyssm8CZmo1IRHtSMF8F0nkD+5rx1FrsrPGRQIzsWeAo4+qm8x+jFvcxVvpD8G6uGq1OvGfu5aAtz3psXWmz5ZVo4F3JJDY3EFAP4cFHWXlflCiqieOfBjItS6hNooz5c94DD1NTFf7K5tZYecjfEBFG1ZHbeJ08zj3mXXf6FkUzzEKsNwdG",
});
const s3 = new AWS.S3();

const bucketName = "shani-assignment-2";
const s3File = "file.txt";
const robUrl = "http://52.91.127.198:8080/start";

function sendRequest() {
	let response = axios
		.post(robUrl, {
			banner: "B00917757",
			ip: "44.193.1.188:5000",
		})
		.then(function (res) {
			console.log(res.data);
		})
		.catch(function (error) {
			console.log(error);
		});
}
sendRequest();

app.post("/storedata", (req, res) => {
	const content = req.body.data;
	const params = { Bucket: bucketName, Key: s3File, Body: content };
	s3.upload(params, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log("File created successfully!!");
			const uri = data.location;
			res.send({ s3uri: uri }).status(200);
		}
	});
});

app.post("/appenddata", (req, res) => {
	newData = req.body.data;
	const getParams = {
		Bucket: bucketName,
		Key: s3File,
	};
	s3.getObject(getParams, (err, data) => {
		if (err) {
			console.log(err, err.stack);
		} else {
			const uploadNewData = data.Body.toString() + newData;
			const uploadParams = {
				Bucket: bucketName,
				Key: s3File,
				Body: uploadNewData,
			};
			s3.upload(uploadParams, (err, data) => {
				if (err) {
					console.log(err);
					res.send(err);
				} else {
					res.sendStatus(200);
					console.log("File updated successfully!");
				}
			});
		}
	});
});

app.post("/deletefile", (req, res) => {
	const deleteFileUri = req.body.s3uri;
	const deletaParams = {
		Bucket: bucketName,
		Key: s3File,
	};
	s3.deleteObject(deletaParams, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			res.sendStatus(200);
		}
	});
});

app.listen(port);
console.log("App is running on port: " + port);
