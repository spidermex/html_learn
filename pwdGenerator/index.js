// Character sets to be use for pwd generation
const charLower = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const charUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const charSymbols = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "-", "+", "=", "{", "[", "}", "]", ",", "|", ":", ";", "<", ">", ".", "?", "/"];
const charNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

// Get DOM elements locations
let pwdLenTxt = document.getElementById("pwdlengthtxt");
let withUpper = document.getElementById("uppercase");
let withNumbers = document.getElementById("numbers");
let withSymbols = document.getElementById("symbols");

// Retrieve the 2 passwords
function getPassword() {
    let length = pwdLenTxt.value;
    let passwordField = document.getElementById("password1");
    passwordField.value = generatePassword(length);
    passwordField = document.getElementById("password2");
    passwordField.value = generatePassword(length);
}

// Generate password based on the char sets selected
function generatePassword(length) {
    // default character set is Lowecase Chars
    let characters = charLower;
    let password = "";
    // add the selected character sets
    if (withUpper.checked) {
        characters = characters.concat(charUpper);
    }
    if (withNumbers.checked) {
        characters = characters.concat(charNumbers);
    }
    if (withSymbols.checked) {
        characters = characters.concat(charSymbols);
    }
    // Generate password using the selected char sets
    for (let i = 0; i < length; i++) {
        password += characters[Math.floor(Math.random() * characters.length)];
    }
    return password;
}

// Copy pwd to Clipboard
function copyPwd(copyText, targetID) {
    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);

    // Change the tooltip text
    let tooltip = document.getElementById(targetID);
    tooltip.innerHTML = "Copied: " + copyText.value;
}

// Change the tooltip text on mouse out event
function outFunc(targetID) {
    let tooltip = document.getElementById(targetID);
    // Change the tooltip text back to "Click to copy"
    tooltip.innerHTML = "Click to copy";
}


