# Local IM

![Icon](https://github.com/ayuopy/local-im/blob/master/resources/icon.png)

### Send messages and files over a local network

## Features

* Instant messaging via websockets
* URL parsing with linkifyjs
* File uploads
* Image thumbnails
* Responsive client

## Usage

Download the relavant binary for your system [here](https://github.com/ayuopy/local-im/releases).

```
$ ./message [OPTION]
```

You can then visit the specified host to begin a new session. By default, the message
server will listen on the localhost, which will not be broadcast to other devices on the
network. Use `hostname -I` to find the relevant host for your
system.

## Options

```
-f      specify a HTML file to serve (default: client.html)
-s      set a host and port to listen on (default: localhost:8080)
-h      print help text
```

## Building from source

Dependencies:
* go (tested and built with v1.7.6)
* [github.com/gorilla/websocket](https://github.com/gorilla/websocket)
* npm
* [linkifyjs](https://github.com/SoapBox/linkifyjs)

Ensure your GOPATH is configured and you are in $GOPATH/src.

```
$ git clone https://github.com/ayuopy/local-im.git
$ cd local-im
```

Install dependencies:
```
$ go get github.com/gorilla/websocket
$ cd static
$ npm install linkifyjs
```

Build:
```
$ go build message.go
```

## Screenshot

![main](https://github.com/ayuopy/local-im/blob/master/resources/main.png)

