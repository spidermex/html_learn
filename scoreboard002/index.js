console.log("run");

// Global variables
let score_home = 0;
let score_guest = 0;
let game_time = "12:00";
let tout_guest = 4;
let tout_home = 4;
let max_time = 720; // Time in seconds for timer
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
    score_home = 0;
    score_guest = 0;
    game_time = "12:00";
    tout_guest = 4;
    tout_home = 4;
    max_time = 720;
    left_time = max_time;
    scoreHomeId.textContent = score_home;
    scoreGuestId.textContent = score_guest;
    gameTimeId.textContent = game_time;
    toutGuestId.textContent = tout_guest;
    toutHomeId.textContent = tout_home;
    winGuestId.style.color = "rgb(48, 47, 51)";
    winHomeId.style.color = "rgb(48, 47, 51)";
}

function add_points(howmany, who) {
    if (who == "home") {
        score_home += howmany;
        scoreHomeId.textContent = score_home;
    } else {
        score_guest += howmany;
        scoreGuestId.textContent = score_guest;
    }

    if (score_guest == score_home) {
        winGuestId.style.color = "rgb(48, 47, 51)";
        winHomeId.style.color = "rgb(48, 47, 51)";
    } else {
        if (score_home > score_guest) {
            winGuestId.style.color = "rgb(48, 47, 51)";
            winHomeId.style.color = "rgb(169, 10, 10)";
        } else {
            winGuestId.style.color = "rgb(169, 10, 10)";
            winHomeId.style.color = "rgb(48, 47, 51)";
        }
    }
}

function to_process(who) {
    if (who == "home" && tout_home > 0) {
        tout_home -= 1;
        toutHomeId.textContent = tout_home;
        new Audio("assets/buzzer.mp3").play();
        stopTimer();
    } else {
        if (who == "guest" && tout_guest > 0) {
            tout_guest -= 1;
            toutGuestId.textContent = tout_guest;
            new Audio("assets/buzzer.mp3").play();
            stopTimer();
        }
    }
}

function reset_game() {
    console.log("reset click");
    initialize_displays();
}

function startTimer() {
    the_timer = setInterval(cuentatime, 1000);
}

function stopTimer() {
    clearInterval(the_timer);
}

function cuentatime() {
    let minutes, seconds;
    //console.log(timer);
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

