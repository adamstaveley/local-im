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
drawFeed();
focusLatest();

var textInput = document.querySelector('input.text-input');
if (window.innerWidth > 500) {
    textInput.focus();
};

var table = document.querySelector('table.feed');

var textForm = document.querySelector('form.text');
textForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var text = textForm.elements[0].value;
    sendMessage(text);
    textInput.value = '';
});

function sendMessage(message) {
    var username = localStorage.getItem('username');
    if (!username) {
        username = 'anonymous';
    };
    var wsMsg = JSON.stringify({
        name: username,
        message: message
    });
    ws.send(wsMsg);
};

ws.onmessage = function(event) {
    var wsMsg = JSON.parse(event.data);
    var name = wsMsg.name;
    var message = wsMsg.message;
    var row = newRow();
    row.firstChild.append(name);
    if (message.match(/(\.jpg)$|(\.jpeg)$|(\.png)$|(\.svg)$|(\.gif)/)) {
        var imgTag = displayPreview(message);
        row.lastChild.appendChild(imgTag);
    } else {
        row.lastChild.append(message);
    }
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
        sendMessage(link);
    };
    fileInput.value = '';
    displayMenu();
    focusLatest();
}, false);

function uploadFile(file) {
    var formData = new FormData();
    formData.append('uploads[]', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.onreadystatechange = function() {  // need to return response from server
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
        };
    };
    xhr.send(formData);
};

function displayPreview(image) {
    image = image.replace(hostname + '/', '');
    var a = document.createElement('a');
    a.href = image;
    var img = document.createElement('img');
    img.src = image;
    img.alt = image;
    a.appendChild(img);

    return a;
};

function newRow() {
    var row = document.createElement('tr');
    var name = document.createElement('td');
    var message = document.createElement('td');
    name.className = 'name';
    message.className = 'message';
    row.append(name);
    row.append(message);
    return row;
};

var options = document.querySelector('div.options');
var menu = document.querySelectorAll('div.menu');
function displayMenu() {
    if (!options.style.display || options.style.display == 'none') {
        options.style.display = 'block';
        menu.forEach((bar) => {
            bar.style.background = '#99c24d';
        });
        if (window.innerWidth > 500) {
            nameInput.focus();
        };
    } else {
        options.style.display = 'none';
        revertMenu();
        if (window.innerWidth > 500) {
            textInput.focus();
        };
    };
};

function revertMenu() {
    menu.forEach((bar) => {
        bar.style.background = '#f8fff4';
    });
};

feed.addEventListener('click', () => {
    options.style.display = 'none';
    revertMenu();
});

textInput.addEventListener('click', () => {
    options.style.display = 'none';
    revertMenu();
});

window.addEventListener('resize', () => {
    drawFeed();
    focusLatest();
});

function drawFeed() {
    var height = document.documentElement.clientHeight;
    feed.style.height = height - 50 + "px";
};

function focusLatest() {
    feed.scrollTop = feed.scrollHeight;
};
