"use strict";

var host = window.location.hostname;
var port = window.location.port;
var hostname = host + ':' + port;

var sock = 'ws://' + hostname + '/echo';
var ws = new WebSocket(sock);

ws.onopen = function(event) {
    console.log(sock);
};
var feed = document.querySelector('div.feed');
var height = document.documentElement.clientHeight;
feed.style.height = height - 50 + "px";

focusLatest();

var table = document.querySelector('table.feed');

var textForm = document.querySelector('form.text');
var textInput = document.querySelector('input.text-input');
textForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var text = textForm.elements[0].value;
    ws.send(text);
    textInput.value = '';
});

ws.onmessage = function(event) {
    var text = event.data;
    var row = newRow();
    row.lastChild.append(text);
    table.append(row);

    focusLatest();
};

var nameForm = document.querySelector('form.name');
var nameInput =document.querySelector('input.name-input');
nameForm.addEventListener('submit', function(event) {
    event.preventDefault();
    localStorage.setItem('username', nameForm.elements[0].value);
    nameInput.value = '';
    displayMenu()
});

var fileInput = document.querySelector('input.file-input');
fileInput.addEventListener('change', () => {
    var files = fileInput.files;
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        uploadFile(file);
        var link = hostname + '/uploads/' + file.name;
        ws.send(link);
        fileInput.value = '';
        displayMenu();
    };
}, false);

function uploadFile(file) {
    console.log('uploading file...');
    var formData = new FormData();
    formData.append('uploads[]', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        };
    };
    xhr.send(formData);
};

var options = document.querySelector('div.options');
function displayMenu() {
    if (!options.style.display || options.style.display == 'none') {
        options.style.display = 'block';
        nameInput.focus();
    } else {
        options.style.display = 'none';
        textInput.focus();
    };
};

function newRow() {
    var row = document.createElement('tr');
    var name = document.createElement('td');
    var message = document.createElement('td');
    name.className = 'name';
    var username = localStorage.getItem('username');
    if (!username) {
        username = 'anonymous';
    };
    name.append(username);
    message.className = 'message';
    row.append(name);
    row.append(message);
    return row;
};

function focusLatest() {
    feed.scrollTop = feed.scrollHeight;
};
