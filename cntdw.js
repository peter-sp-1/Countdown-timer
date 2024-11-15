const startBtn = document.getElementById('startBtn');
const pauseResumeBtn = document.getElementById('pauseResumeBtn');
const targetDateInput = document.getElementById('targetDate');
const endMessageInput = document.getElementById('endMessageInput');
const timeDisplay = document.getElementById('time');
const endMessage = document.getElementById('endMessage');
let countdownInterval;
let isPaused = false;
let timeRemaining; //Keep track of remaining time to support pause functionality.

function saveCountdownData(targetDate, remainingTime, customMessage, paused) {
    const data = {
        targetDate: targetDate.getTime(),
        timeRemaining: remainingTime,
        customMessage: customMessage,
        isPaused: paused
    };
    localStorage.setItem('countdownData', JSON.stringify(data));
}

function loadCountdownData() {
    const data = localStorage.getItem('countdownData');
    return data ? JSON.parse(data) : null;
}

function clearCountdownData() {
    localStorage.removeItem('countdownData');
}

function startCountdown() {
    const targetDate = new Date(targetDateInput.value);
    if (isNaN(targetDate)) {
        alert('Please select a valid date and time!');
        return;
    }

    clearInterval(countdownInterval); //Clear existing countdowns
    isPaused = false;
    pauseResumeBtn.textContent = "Pause"; // Set button to "Pause"
    pauseResumeBtn.style.display = 'inline'; //Show pause/resume button
    endMessage.style.display = 'none'; //Hide end message if prevously shown
    timeRemaining = targetDate - new Date(); // Initial time remaining

    saveCountdownData(targetDate, timeRemaining, endMessageInput.value, isPaused);
    
    countdownInterval = setInterval(() => {
        if (!isPaused) {
            const now = new Date();
            timeRemaining = targetDate - now;

            if (timeRemaining <= 0){
                clearInterval(countdownInterval);
                timeDisplay.textContent = "00d 00h 00m 00s";
                endMessage.textContent = endMessageInput.value || "Countdown Complete!";
                endMessage.style.display = 'block';
                pauseResumeBtn.style.display = 'none'; // Hide pause/resume button when complete
            } else {
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                timeDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                saveCountdownData(targetDate, timeRemaining, endMessageInput.value, isPaused);
            }
        }
    }, 1000);
}

function togglePauseResume() {
    isPaused = !isPaused; //Toggle the paused state
    pauseResumeBtn.textContent = isPaused ? "Resume" : "Pause"; // update button text
    saveCountdownData(new Date(targetDateInput.value), timeRemaining, endMessageInput.value, isPaused);
}

function resumeCountdown(data) {
    const targetDate = new Date(data.targetDate);
    timeRemaining = data.timeRemaining;
    isPaused = data.isPaused;
    endMessageInput.value = data.customMessage || "";
    pauseResumeBtn.textContent = isPaused ? "Resume" : "Pause";
    pauseResumeBtn.style.display = 'inline';

    countdownInterval = setInterval(() => {
        if (!isPaused) {
            const now = new Date();
            timeRemaining = targetDate - now;

            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                clearCountdownData();
                timeDisplay.textContent = "00d 00h 00m 00s";
                endMessage.textContent = data.customMessage || "Countdown Complete!";
                endMessage.style.display = 'block';
                pauseResumeBtn.style.display = 'none';
            } else {
                const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
                timeDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                saveCountdownData(targetDate, timeRemaining, endMessageInput.value, isPaused);
            }
        }
    }, 1000);
}

startBtn.addEventListener('click', startCountdown);
pauseResumeBtn.addEventListener('click', togglePauseResume);

document.addEventListener('DOMContentLoaded', () => {
    const savedData = loadCountdownData();
    if (savedData && savedData.timeRemaining > 0) {
        resumeCountdown(savedData)
    }
})


