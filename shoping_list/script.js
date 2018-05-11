// Demo on: http://jsbin.com/yafokey/edit?css,js,output

var button = document.getElementById("enter");
var input = document.getElementById("userinput");
var myul = document.querySelector("ul");
var myli = myul.getElementsByTagName("li");

function inputLength() {
   return input.value.length;
}

// Here we insert a new row to the UL including a delete button
function createListElement() {
   var li = document.createElement("li");
   var bot = document.createElement("button");
   var spa = document.createElement("span");
   spa.className = "fas fa-trash";
   bot.className = "myboton";
   bot.onclick = borrar2;
   //bot.appendChild(document.createTextNode("<span class="">"));
   bot.appendChild(spa);
   li.appendChild(document.createTextNode(input.value));
   li.appendChild(bot);
   myul.appendChild(li);
   input.value = "";
}

//Insert a new row after a mouse clik on button
function addListAfterClick() {
   if (inputLength() > 0) {
      createListElement();
   }
}

//Insert a new row after key 'ENTER'
function addListAfterKeypress(event) {
   if (inputLength() > 0 && event.keyCode === 13) {
      createListElement();
   }
}

//we delete a row after a mouse dbl-click 
function borrar(elemento) {
   console.log('Dblclick detected');
   if (confirm("Are you sure you want to delete: \n" + elemento.target.innerText + "?")) {
      elemento.target.remove();
   }
}

// we change the 'status' of the task after a single mouse click
function doneFunc(event) {
   console.log("Element Name=", event.target.tagName);
   if (event.target.tagName === "LI") {
      event.target.classList.toggle("done");
   }
}

// we delete the row after click on the 'delete' button
function borrar2(elemento) {
   console.log('click detected');
   if (confirm("Are you sure you want to delete: \n" + elemento.currentTarget.parentNode.innerText + "?")) {
      elemento.currentTarget.parentNode.remove();
   }
}

// We insert the 'delete' button to each row after page load
function add_trash() {
   for (var i = 0, len = myli.length; i < len; i++) {
      var myitem = myli[i];
      var bot = document.createElement("button");
      var spa = document.createElement("span");
      spa.className = "fas fa-trash";
      bot.className = "myboton";
      bot.onclick = borrar2;
      bot.appendChild(spa);
      myitem.appendChild(bot);
   }
}


// call function to insert buttons on list
add_trash();

// here we create several event listeners
button.addEventListener("click", addListAfterClick);
input.addEventListener("keypress", addListAfterKeypress);
myul.addEventListener("dblclick", borrar);
myul.addEventListener("click", doneFunc)
