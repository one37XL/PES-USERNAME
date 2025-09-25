
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAgl9G_XxB4UGHyTeKF0OiauYzU97IbQE8",
    authDomain: "pes-username.firebaseapp.com",
    projectId: "pes-username",
    storageBucket: "pes-username.firebasestorage.app",
    messagingSenderId: "54971554163",
    appId: "1:54971554163:web:759a82758451cbaeefcd06",
    measurementId: "G-N5ZEFBWFKK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase (commented out for now since we don't have actual config)
// firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// Mock data for demonstration
const mockPlayers = [
    { id: 1, username: "PESMaster2023", region: "Europe" },
    { id: 2, username: "GoalHunter", region: "Asia" },
    { id: 3, username: "DribbleKing", region: "North America" },
    { id: 4, username: "SuperStriker", region: "South America" },
    { id: 5, username: "DefenseWall", region: "Africa" },
    { id: 6, username: "MidfieldMaestro", region: "Oceania" }
];

// DOM elements
const usernameForm = document.getElementById('usernameForm');
const playersList = document.getElementById('playersList');
const filterRegion = document.getElementById('filterRegion');
const refreshBtn = document.getElementById('refreshBtn');

// Load players (using mock data for now)
function loadPlayers(regionFilter = '') {
    playersList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading players...</p></div>';

    // Simulate API delay
    setTimeout(() => {
        let filteredPlayers = mockPlayers;

        if (regionFilter) {
            filteredPlayers = mockPlayers.filter(player => player.region === regionFilter);
        }

        if (filteredPlayers.length === 0) {
            playersList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users-slash"></i>
                            <h3>No players found</h3>
                            <p>Try changing your filter or add yourself as a player!</p>
                        </div>
                    `;
            return;
        }

        playersList.innerHTML = filteredPlayers.map(player => `
                    <div class="player-card">
                        <div class="player-username">${player.username}</div>
                        <div class="player-region">
                            <i class="fas fa-globe"></i> ${player.region}
                        </div>
                        <div class="player-actions">
                            <button class="action-btn primary">
                                <i class="fas fa-user-plus"></i> Connect
                            </button>
                            <button class="action-btn secondary">
                                <i class="fas fa-gamepad"></i> Challenge
                            </button>
                        </div>
                    </div>
                `).join('');
    }, 800);
}

// Form submission handler
usernameForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const region = document.getElementById('region').value;

    if (!username || !region) {
        alert('Please fill in all fields');
        return;
    }

    // In a real app, this would save to Firebase
    // db.collection('players').add({
    //     username: username,
    //     region: region,
    //     timestamp: firebase.firestore.FieldValue.serverTimestamp()
    // })

    // For demo purposes, add to mock data
    const newPlayer = {
        id: mockPlayers.length + 1,
        username: username,
        region: region
    };

    mockPlayers.push(newPlayer);

    // Reset form
    usernameForm.reset();

    // Show success message
    alert(`Player ${username} from ${region} added successfully!`);

    // Reload players list
    loadPlayers(filterRegion.value);
});

// Filter change handler
filterRegion.addEventListener('change', function () {
    loadPlayers(this.value);
});

// Refresh button handler
refreshBtn.addEventListener('click', function () {
    loadPlayers(filterRegion.value);
});

// Initial load
loadPlayers();