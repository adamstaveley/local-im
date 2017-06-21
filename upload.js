"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var express = require('express');
var formidable = require('formidable');

const hostname = 'localhost';
const port = 8080;

var app = express();

app.post('/upload', (req, res) => {
    console.log('received post at /upload');
    var form = new formidable.IncomingForm();
    form.multiples = true;
    form.uploadDir = __dirname + '/static/uploads';
    form.on('file', (field, file) => {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    })

    form.parse(req, (err, fields, files) => {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('upload received: ');
        res.end(util.inspect({files: files}));
    });

    return;
});

app.listen(port, hostname, () => {
    console.log(`Listening on ${hostname}:${port}/upload`)
});

