package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients []*websocket.Conn

var messages []message

type message struct {
	msgType int
	msg     []byte
}

var upgrader = websocket.Upgrader{}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	if !existingClient(conn) {
		for _, m := range messages {
			writeMsg(conn, m.msgType, m.msg)
		}
	}
	clients = append(clients, conn)
	defer conn.Close()
	for {
		var m message
		m.msgType, m.msg, err = conn.ReadMessage()
		if err != nil {
			log.Println("ReadMessage:", err)
			break
		}
		messages = append(messages, m)
		log.Println("Received:", m.msg)
		for _, c := range clients {
			writeMsg(c, m.msgType, m.msg)
		}
	}
}

func existingClient(client *websocket.Conn) bool {
	var extant bool
	for _, conns := range clients {
		switch conns {
		case client:
			extant = true
			break
		default:
			extant = false
		}
	}
	return extant
}

func writeMsg(conn *websocket.Conn, msgType int, msg []byte) {
	if err := conn.WriteMessage(msgType, msg); err != nil {
		log.Println("WriteMessage:", err)
	}
}

func htmlHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, *file)
}

var file = flag.String("f", "share.html", "Specify a HTML file to serve")
var host = flag.String("s", "localhost:8080", "Set a host and port to listen on")

func main() {
	flag.Parse()
	log.Printf("Listening on: %s/share", *host)

	http.HandleFunc("/echo", wsHandler)
	http.HandleFunc("/share", htmlHandler)
	http.ListenAndServe(*host, nil)
}
