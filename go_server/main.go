package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"

)


func main() {
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		fmt.Println("connected:", s.ID())
		return nil
	})
	server.OnEvent("/", "my event", func(s socketio.Conn, msg string) {
		fmt.Println("notice:", msg)
		s.Emit("reply", "have "+msg)
	})
	
	go server.Serve()
	defer server.Close()

	//http.Handle("/socket.io/", server)
	http.HandleFunc("/socket.io/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:19006")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        server.ServeHTTP(w, r)
    })
	http.Handle("/", http.FileServer(http.Dir("./static")))
	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
