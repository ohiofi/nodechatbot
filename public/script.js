/* global io */
// client-side js, loaded by index.html
// run by the browser each time the page is loaded

var socket = io.connect();
console.log("hello world :o");

// define variables that reference elements on our page
const mylist = document.getElementById("mylist");
// const dreamsForm = document.querySelector("form");
var textbox = document.getElementById("userQuestionBox")

function preventBehavior(e) {
  e.preventDefault(); 
};
// $('form input').keydown(function (e) {
//     if (e.keyCode == 13) {
        
//     }
// });

document.onkeydown = function(e)
{
  
  switch (e.keyCode)
  {
    case 13: // enter
      submitQuestion();
      e.preventDefault();
      //console.log(13);
      
      
  }
}

function submitQuestion(){
  var node = document.createElement("LI");                 // Create a <li> node
  //var textnode = document.createTextNode(data);  
  // Create a text node
  node.innerHTML = textbox.value;
  node.classList.add("from-me");
  //node.appendChild(textnode);                              // Append the text to <li>
  mylist.appendChild(node);
  socket.emit("userquestion",textbox.value)
  textbox.value="";
}



socket.on('servermessage', function(data)
{
  //alert(data);
  var node = document.createElement("LI");                 // Create a <li> node
  //var textnode = document.createTextNode(data);  
  // Create a text node
  node.innerHTML = data;
  node.classList.add("to-me");
  //node.appendChild(textnode);                              // Append the text to <li>
  mylist.appendChild(node);     // Append <li> to <ul> with id="myList"
});

socket.on('server reset', function(data)
{
  location.reload();
});

socket.emit("hi","hi")