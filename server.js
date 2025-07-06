//// server.js
// where your node app starts

// load dictionary
var fs = require("fs");
var dictionary = {};
var submittedQuestions = [];
// on server reset load from scores.json
fs.readFile("dictionary.json", function(err, data) {
  if (err) {
    throw err;
  }
  console.log("loaded from dictionary.json");
  dictionary = JSON.parse(data);
  console.log(dictionary);
});
fs.readFile("submittedQuestions.json", function(err, data) {
  if (err) {
    throw err;
  }
  console.log("loaded from submittedQuestions.json");
  submittedQuestions = JSON.parse(data);
  console.log(submittedQuestions);
});


// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
// listen for requests :)
server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

var userinput = "default";

// web socket starts when a new user joins
io.on("connection", function(socket) {
  // emit help
  //
  // emit back to the "sender" player
  //  socket.emit('hello', 'can you hear me?', 1, 2, 'abc');
  //
  // emit to all players except the "sender" player
  //  socket.broadcast.emit('broadcast', 'hello friends!');
  //
  // emit to all players
  //  io.sockets.emit('countdown', clock);

  // this section happens when the user first connects to the server
  //socket.emit("servermessage","hellow");
  //console.log("hellow")

  socket.on("userquestion", function(data) {
    // this section happens when user submits
    //console.log(data)
    let counter = 0;
    if (data != null) {
      if(!submittedQuestions.includes(data)){
        submittedQuestions.push(data)  
      }
      
      var userinput = data.toLowerCase();
      for (let each in dictionary) {
        if (userinput.includes(each)) {
          counter++;
          //console.log(dictionary[each])
          socket.emit("servermessage", randomOf(dictionary[each]));
        }
      }
      if(counter < 1){
        socket.emit("servermessage", randomOf(dictionary["default"]));
      }
    }
  });

  socket.on("hi", function(data) {
    socket.emit(
      "servermessage",
      "Hello! Type a question and I will try to answer it"
    );
  });
});

function randomOf(someArray){
  return someArray[Math.floor(Math.random()*someArray.length)]
}

function writeToDictionary() {
  fs.writeFile(
    "dictionary.json",
    JSON.stringify(dictionary, null, 2),
    finished
  );
  function finished(err) {
    console.log(err);
    console.log("saved to dictionary.json");
  }
}
function writeToQuestions() {
  fs.writeFile(
    "submittedQuestions.json",
    JSON.stringify(submittedQuestions, null, 2),
    finished
  );
  function finished(err) {
    console.log(err);
    console.log("saved to submittedQuestions.json");
  }
}




setTimeout(function(){ // this only happens if the server freezes and restarts
  io.sockets.emit('server reset', true);
}, 1000);