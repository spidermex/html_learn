console.log("run");

// Global variables
const isOn= "rgb(169, 10, 10)";
const isOff= "rgb(48, 47, 51)";
const max_time = 720; // Time in seconds for timer
let score_home = 0;
let score_guest = 0;
let game_time = "12:00";
let tout_guest = 4;
let tout_home = 4;
let left_time = max_time;
let the_timer; // Variable for timer


//DOM content locations
let scoreHomeId = document.getElementById("score_home");
let scoreGuestId = document.getElementById("score_guest");
let gameTimeId = document.getElementById("game_time");
let toutGuestId = document.getElementById("tout_guest");
let toutHomeId = document.getElementById("tout_home");
let winHomeId = document.getElementById("win_home");
let winGuestId = document.getElementById("win_guest");

// Initialize Displays
function initialize_displays() {
    score_home=0;
    score_guest = 0;
    game_time = "12:00";
    tout_guest = 4;
    tout_home = 4;
    left_time = max_time;
    scoreHomeId.textContent = score_home;
    scoreGuestId.textContent = score_guest;
    gameTimeId.textContent = game_time;
    toutGuestId.textContent = tout_guest;
    toutHomeId.textContent = tout_home;
    winGuestId.style.color = isOff;
    winHomeId.style.color = isOff;
}

function add_points(howmany, who) {
    if (who === "home") {
        score_home += howmany;
        scoreHomeId.textContent = score_home;
    } else {
        score_guest += howmany;
        scoreGuestId.textContent = score_guest;
    }
    whosWinning()
}

function whosWinning(){
    if (score_guest === score_home) {
        winGuestId.style.color = isOff;
        winHomeId.style.color = isOff;
    } else {
        if (score_home > score_guest) {
            winGuestId.style.color = isOff;
            winHomeId.style.color = isOn;
        } else {
            winGuestId.style.color = isOn;
            winHomeId.style.color = isOff;
        }
    }
}

function timeOut_process(who) {
    if (who === "home" && tout_home > 0) {
        tout_home -= 1;
        toutHomeId.textContent = tout_home;
        playBuzzer();
        stopTimer();
    } else {
        if (who === "guest" && tout_guest > 0) {
            tout_guest -= 1;
            toutGuestId.textContent = tout_guest;
            playBuzzer();
            stopTimer();
        }
    }
}

function playBuzzer() {
    new Audio("assets/buzzer.mp3").play();
}
function reset_game() {
    console.log("reset click");
    initialize_displays();
}

function startTimer() {
    the_timer = setInterval(CountTime, 1000);
}

function stopTimer() {
    clearInterval(the_timer);
}

function CountTime() {
    let minutes, seconds;
    minutes = parseInt(left_time / 60, 10)
    seconds = parseInt(left_time % 60, 10)
    minutes = minutes < 10 ? "0" + minutes : minutes
    seconds = seconds < 10 ? "0" + seconds : seconds
    gameTimeId.textContent = minutes + ":" + seconds
    //    console.log(left_time);
    if (--left_time < 0) {
        left_time = max_time;
        stopTimer();
    }
}

