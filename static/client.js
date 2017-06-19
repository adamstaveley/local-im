var sock = 'ws://localhost:8080/echo';
var ws = new WebSocket(sock);

ws.onopen = function(event) {
    console.log(sock);
}

var textForm = document.querySelector('form.text');
var nameForm = document.querySelector('form.name');
var username;

var feed = document.querySelector('div.feed');
var height = document.documentElement.clientHeight;
feed.style.height = height - 55 + "px";

var textInput = document.querySelector('input.text-input');
var nameInput =document.querySelector('input.name-input');
focusLatest()

textForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var text = textForm.elements[0].value;
    if (!username) {
        username = 'anonymous';
    }
    msg = JSON.stringify({
        name: username,
        message: text
    });
    ws.send(msg);
    textInput.value = '';
})

nameForm.addEventListener('submit', function(event) {
    event.preventDefault();
    username = nameForm.elements[0].value;
    var nameInput = document.querySelector('input.name-input');
    nameInput.value = '';
    displayMenu()
})

ws.onmessage = function(event) {
    var text = JSON.parse(event.data);
    var username = text.name;
    var msg = text.message;

    var table = document.querySelector('table');
    var row = document.createElement('tr');

    var name = document.createElement('td');
    var message = document.createElement('td');
    name.className = 'name';
    message.className = 'message';

    name.append(username);
    row.append(name);
    message.append(msg);
    row.append(message);
    table.append(row);

    focusLatest();
}

function displayMenu() {
    if (!nameInput.style.display || nameInput.style.display == 'none') {
        nameInput.style.display = 'block';
        nameInput.focus();
    } else {
        nameInput.style.display = 'none';
        textInput.focus();

    }
}

function focusLatest() {
    feed.scrollTop = feed.scrollHeight;
}
