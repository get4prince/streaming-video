var express = require("express");
let app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var ss = require("socket.io-stream");

app.use(express.static(__dirname + "/"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socket => {

  console.log("a user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  ss(socket).on('file', function(steam){
    console.log("prince aa gya!");
    console.log(stream);
  });

});

http.listen(3000, () => {
  console.log("listing to server 3000");
});
