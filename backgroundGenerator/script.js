var css = document.querySelector("h3");
var color1 = document.querySelector(".color1");
var color2 = document.querySelector(".color2");
var mybody = document.getElementById("gradient");
var botReload = document.getElementById("original");
var botRandom = document.getElementById("rancolor");
var botClipboard= document.getElementById("crystalBut");
var col1Orig=0;
var col2Orig=0;


function copyGradient() {
   // Select the  element's  text  
   var dato = document.getElementById('infoGrad');
   var range = document.createRange();
   range.selectNode(dato);
   window.getSelection().addRange(range);
   try {
      // Now that we've selected the text, execute the copy command  
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copy text command was ' + msg);
      alert('Copy text command was ' + msg);
   } catch (err) {
      console.log('Oops, unable to copy');
   }
   // Remove the selections - NOTE: Should use
   // removeRange(range) when it is supported  
   window.getSelection().removeAllRanges();
}

function setGradient() {
   mybody.style.background =
      "linear-gradient(to right, " +
      color1.value +
      ", " +
      color2.value +
      ")";
   css.textContent = mybody.style.background + ";";
}

function myRandomNum(min, max) {
   return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomColor() {
   return rgbToHex(myRandomNum(0,255),myRandomNum(0,255),myRandomNum(0,255));
}

function randomizeColors(){
   color1.value=randomColor();
   color2.value=randomColor();
   botReload.style.backgroundColor=color2.value;
   botRandom.style.backgroundColor=color1.value;
   setGradient();
   }

//Since we were given the colors in WORD/NAME on the original CSS style ...grrrr
// we have to convert those names to their correspondent HEX values
function getHexColor(colorStr) {
   var a = document.createElement('div');
   a.style.color = colorStr;
   var colors = window.getComputedStyle(document.body.appendChild(a))
      .color.match(/\d+/g)
      .map(function(a) {
         return parseInt(a, 10);
      });
   document.body.removeChild(a);
   return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2])
      .toString(16)
      .substr(1)) : false;
}

function componentToHex(c) {
   var hex = c.toString(16);
   return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
   return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function setOrigGradient() {
   color1.value=col1Orig;
   color2.value=col2Orig;
   botRandom.style.backgroundColor=col1Orig;
   botReload.style.backgroundColor=col2Orig;
   setGradient();
}
// Function to retrieve the ORIGINAL colors from the CSS style on PageLoad
// We extract the 'NAMES' or RGB values that the CSS style has and then 
// convert them to HEX and assign theem to the corresponding starting values .... grrrrr...
function getOriginalgradient() {
   var myStyle = window.getComputedStyle(mybody, null).getPropertyValue("background-image");
   //console.log("Color Values", myStyle);
   if (myStyle.indexOf("rgb") !== -1) {
      var res = myStyle.split("linear-gradient")[1].split(",");
      res.splice(0, 1);
      myStyle = res.toString();
      var col1 = myStyle.split("rgb(")[1].split("),", 1)[0].split(", ");
      var col2 = myStyle.split("rgb(")[2].split(")", 1)[0].split(", ");
      color1.value = rgbToHex(parseInt(col1[0]), parseInt(col1[1]), parseInt(col1[2]));
      color2.value = rgbToHex(parseInt(col2[0]), parseInt(col2[1]), parseInt(col2[2]));
   } else {
      var res = myStyle.split('linear-gradient(')[1].split(')', 1)[0].split(",");
      color1.value = getHexColor(res[1]);
      color2.value = getHexColor(res[2]);
   }
   col1Orig=color1.value;
   col2Orig=color2.value;
   botRandom.style.backgroundColor=col1Orig;
   botReload.style.backgroundColor=col2Orig;
   setGradient();
}

// Event listeners for the buttons and color selectors. Also for copy to clipboard
botClipboard.addEventListener("click", copyGradient);
color1.addEventListener("input", setGradient);
color2.addEventListener("input", setGradient);
botReload.addEventListener("click", setOrigGradient);
botRandom.addEventListener("click", randomizeColors);

//At fir load, we retrieve the colors that were set on the CSS file
getOriginalgradient();



