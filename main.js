import { CONFIG } from './config.js';
import { calculateLeaderboard } from './lib/leaderboard.js';
const GOOGLE_SHEETS_WEB_APP_URL = CONFIG.GOOGLE_SHEETS_WEB_APP_URL;
document.getElementById('webAppId').textContent += GOOGLE_SHEETS_WEB_APP_URL;

const nameList = [];
const timerData = [];
const rosters = {};
const avatarMap = {
    'player1': '1aBcDeFgHiJkLmNoPqRsTuVwXyZ',
    'player2': '2aBcDeFgHiJkLmNoPqRsTuVwXyZ',
    'player3': '3aBcDeFgHiJkLmNoPqRsTuVwXyZ',
    // Add more player-to-ID mappings here
};
const defaultAvatar = 'https://i.ibb.co/zZXMLTT/default-avatar.png';
const defaultAvatarLocal = 'https://i.ibb.co/zZXMLTT/default-avatar.png'; // Placeholder image as default avatar
let leaderboardChart;

// Ensure the audio file is loaded before it is played
const pointSound = document.getElementById("pointSound");
pointSound.addEventListener("canplaythrough", () => {
    console.log("Point sound is ready to play");
});
const bonusSound = document.getElementById("bonusSound");
bonusSound.addEventListener("canplaythrough", () => {
    console.log("Bonus sound is ready to play");
});

const backgroundMusic = document.getElementById("backgroundMusic");
backgroundMusic.src = CONFIG.BACKGROUND_MUSIC_URL;

async function sendToGoogleSheets(data) {
    try {
        console.log('Sending data to Google Sheets:', data);
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to send data to Google Sheets');
        }

        console.log('Data sent to Google Sheets:', data);
        displaySuccessMessage('Data successfully sent to Google Sheets');
    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);
        if (error instanceof TypeError) {
            displayErrorMessage('Network error. Please check your connection.');
        } else {
            displayErrorMessage('Failed to send data to Google Sheets');
        }
    }
}

function displaySuccessMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'success-message';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 3000);
}

function displayErrorMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'error-message';
    messageElement.textContent = message;
    document.body.appendChild(messageElement);
    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 3000);
}

function addNameToList(name) {
    nameList.push(name);
    updateNameList();
    updateRosterOptions();
    console.log('Name added:', name);
}

function updateNameList() {
    const nameListElement = document.getElementById("playerList");
    nameListElement.innerHTML = "";
    nameList.forEach((name) => {
        const listItem = document.createElement("li");
        listItem.textContent = name;
        nameListElement.appendChild(listItem);
    });
    console.log('Updated name list:', nameList);
}

document.getElementById("addNameButton").addEventListener("click", () => {
    const nameInput = document.getElementById("nameInput");
    const name = nameInput.value.trim();
    if (name) {
        addNameToList(name);
        updateNameList();
        nameInput.value = "";
        displaySuccessMessage('Name added successfully');
    } else {
        displayErrorMessage('Please enter a valid name');
    }
});

document.getElementById("startAllButton").addEventListener("click", () => {
    startGameForAll();
    backgroundMusic.play(); // Play background music on loop
});

document.getElementById("saveRosterButton").addEventListener("click", () => {
    const rosterName = document.getElementById("rosterNameInput").value.trim();
    if (rosterName && nameList.length > 0) {
        rosters[rosterName] = [...nameList];
        updateRosterOptions();
        sendToGoogleSheets({ rosterName, roster: rosters[rosterName] });
        displaySuccessMessage('Roster saved successfully');
    } else {
        displayErrorMessage('Please enter a valid roster name and add at least one name');
    }
});

document.getElementById("rosterSelect").addEventListener("change", () => {
    const selectedRoster = document.getElementById("rosterSelect").value;
    if (selectedRoster !== "default" && rosters[selectedRoster]) {
        nameList.splice(0, nameList.length, ...rosters[selectedRoster]);
        updateNameList();
    }
});

function updateRosterOptions() {
    const rosterSelect = document.getElementById("rosterSelect");
    rosterSelect.innerHTML = '<option value="default">Select Roster</option>';
    Object.keys(rosters).forEach((rosterName) => {
        const option = document.createElement("option");
        option.value = rosterName;
        option.textContent = rosterName;
        rosterSelect.appendChild(option);
    });
    console.log('Updated roster options:', rosters);
}

function startGameForAll() {
    const selectedVI = parseInt(document.getElementById("viSelect").value);
    const viInterval = selectedVI * 60;

    nameList.forEach((name, index) => {
        startGame(index, viInterval);
    });

    updateLeaderboard();
}

function startGame(index, viInterval) {
    console.log('Starting game for player index:', index, 'with VI interval:', viInterval);

    const timerBar = document.createElement("div");
    timerBar.className = "timerBar";
    timerBar.innerHTML = `<div id="timerFill_${index}" class="timerFill"></div>`;

    const pauseButton = document.createElement("button");
    pauseButton.textContent = "Pause";
    pauseButton.addEventListener("click", () => {
        togglePause(index);
    });

    const bonusPointButton = document.createElement("button");
    bonusPointButton.textContent = "Bonus Point";
    bonusPointButton.addEventListener("click", () => {
        addBonusPoint(index);
    });

    const reasonSelect = document.createElement("select");
    reasonSelect.style.display = "none";
    reasonSelect.innerHTML = `
        <option value="">Select Reason</option>
        <option value="off-task">Off-task</option>
        <option value="noncompliance">Noncompliance</option>
        <option value="disruption">Disruption</option>
        <option value="property-destruction">Property Destruction</option>
        <option value="aggression">Aggression</option>
    `;
    reasonSelect.addEventListener("change", () => {
        timerData[index].pauseReason = reasonSelect.value || "off-task";
    });

    const listItem = document.createElement("div");
    listItem.className = "playerItem";
    listItem.innerHTML = `
        <span>${nameList[index]}: <span id="points_${index}">${timerData[index]?.points || 0}</span> points</span>
    `;
    listItem.appendChild(pauseButton);
    listItem.appendChild(bonusPointButton);
    listItem.appendChild(reasonSelect);
    listItem.appendChild(timerBar);

    const playerName = nameList[index].toLowerCase().replace(/ /g, '-');
    const avatarId = avatarMap[playerName];
    const avatarImage = document.createElement("img");
    avatarImage.src = avatarId ? `https://drive.google.com/uc?export=view&id=${avatarId}` : defaultAvatar;
    avatarImage.className = "avatar";

    avatarImage.onerror = () => {
        console.error(`Failed to load avatar for player ${nameList[index]}, using default avatar.`);
        avatarImage.src = defaultAvatar;
    };

    listItem.appendChild(avatarImage);

    const timerListElement = document.getElementById("timerList");
    timerListElement.appendChild(listItem);

    const currentTime = new Date();
    timerData[index] = {
        points: 0,
        isPaused: false,
        pausedDuration: 0,
        selectedDuration: parseInt(document.getElementById("durationSelect").value),
        viInterval: viInterval,
        startTime: currentTime,
        timestamps: [],
        pauseReason: ""
    };

    const intervalId = setInterval(() => {
        updatePointsAndTimer(index);
    }, 1000);

    timerData[index].intervalId = intervalId;
    console.log('Timer data for player index:', index, timerData[index]);
}

function updatePointsAndTimer(index) {
    const currentTime = new Date();
    const elapsedTime = (currentTime - timerData[index].startTime) / 1000;

    if (!timerData[index].isPaused) {
        if (elapsedTime >= timerData[index].viInterval) {
            timerData[index].points += 1;
            document.getElementById(`points_${index}`).textContent = timerData[index].points;
            timerData[index].startTime = new Date();

            if (pointSound.readyState >= 2) {
                pointSound.currentTime = 0;
                pointSound.play();
            }

            updateLeaderboard();

            sendToGoogleSheets({
                name: nameList[index],
                timestamp: new Date().toLocaleString(),
                points: timerData[index].points,
                isPaused: timerData[index].isPaused,
                reason: timerData[index].pauseReason
            });
        }
    } else {
        const remainingPauseTime = timerData[index].selectedDuration - elapsedTime;
        if (remainingPauseTime <= 0) {
            togglePause(index);
        } else {
            const fillPercentage = remainingPauseTime / timerData[index].selectedDuration * 100;
            document.getElementById(`timerFill_${index}`).style.width = `${fillPercentage}%`;
        }
    }

    updatePauseTimers(index);
}

function updatePauseTimers(index) {
    const playerItem = document.querySelector(`#timerList .playerItem:nth-child(${index + 1})`);
    if (timerData[index].isPaused) {
        playerItem.querySelector('.timerBar').style.display = 'block';
        playerItem.querySelector('select').style.display = 'block';
    } else {
        playerItem.querySelector('.timerBar').style.display = 'none';
        playerItem.querySelector('select').style.display = 'none';
    }
    console.log('Updated pause timers for player index:', index, timerData[index].isPaused);
}

function togglePause(index) {
    timerData[index].isPaused = !timerData[index].isPaused;

    if (timerData[index].isPaused) {
        const pauseTimestamp = new Date().toLocaleTimeString();
        timerData[index].timestamps.push(pauseTimestamp);

        timerData[index].pausedDuration = (new Date() - timerData[index].startTime) / 1000 + timerData[index].selectedDuration;
        timerData[index].startTime = new Date();
    } else {
        const reasonSelect = document.querySelector(`#timerList .playerItem:nth-child(${index + 1}) select`);
        const pauseReason = reasonSelect.value || "off-task";

        sendToGoogleSheets({
            name: nameList[index],
            timestamp: new Date().toLocaleString(),
            points: timerData[index].points,
            isPaused: timerData[index].isPaused,
            reason: pauseReason
        });
        displaySuccessMessage(`Pause reason: ${pauseReason} recorded successfully`);

        timerData[index].startTime = new Date();
        reasonSelect.value = "";
    }

    updatePauseTimers(index);
    updateLeaderboard();
}

function addBonusPoint(index) {
    timerData[index].points += 1;
    document.getElementById(`points_${index}`).textContent = timerData[index].points;
    if (bonusSound.readyState >= 2) {
        console.log('Playing bonus sound');
        bonusSound.currentTime = 0;
        bonusSound.play();
    } else {
        console.error('Bonus sound is not ready to play');
    }
    updateLeaderboard();
    sendToGoogleSheets({
        name: nameList[index],
        timestamp: new Date().toLocaleString(),
        points: timerData[index].points,
        isPaused: timerData[index].isPaused,
        reason: timerData[index].pauseReason
    });
    console.log('Added bonus point for player index:', index, timerData[index].points);
}

function updateLeaderboard() {
    const leaderboardData = calculateLeaderboard(nameList, timerData);

    const maxPoints = Math.max(...leaderboardData.map(data => data.points)) * 1.5;

    if (!leaderboardChart) {
        const ctx = document.getElementById('leaderboardChart').getContext('2d');
        leaderboardChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: leaderboardData.map(data => data.name),
                datasets: [{
                    label: 'Points',
                    data: leaderboardData.map(data => data.points),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)'
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: maxPoints
                    }
                }
            }
        });
    } else {
        leaderboardChart.data.labels = leaderboardData.map(data => data.name);
        leaderboardChart.data.datasets[0].data = leaderboardData.map(data => data.points);
        leaderboardChart.options.scales.y.max = maxPoints;
        leaderboardChart.update();
    }
    console.log('Updated leaderboard:', leaderboardData);
}
