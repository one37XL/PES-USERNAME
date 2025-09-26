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

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// DOM elements
const usernameForm = document.getElementById('usernameForm');
const playersList = document.getElementById('playersList');
const filterRegion = document.getElementById('filterRegion');
const refreshBtn = document.getElementById('refreshBtn');

// Load players from Firestore
async function loadPlayers(regionFilter = '') {
    playersList.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading players...</p></div>';

    try {
        let playersQuery;
        const playersCollection = collection(db, 'players');
        
        if (regionFilter) {
            playersQuery = query(playersCollection, where('region', '==', regionFilter));
        } else {
            playersQuery = playersCollection;
        }

        const querySnapshot = await getDocs(playersQuery);
        const players = [];
        
        querySnapshot.forEach((doc) => {
            players.push({ id: doc.id, ...doc.data() });
        });

        if (players.length === 0) {
            playersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users-slash"></i>
                    <h3>No players found</h3>
                    <p>Try changing your filter or add yourself as a player!</p>
                </div>
            `;
            return;
        }

        playersList.innerHTML = players.map(player => `
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
    } catch (error) {
        console.error("Error loading players: ", error);
        playersList.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading players</h3>
                <p>Please try again later</p>
            </div>
        `;
    }
}

// Real-time listener for players (optional - uncomment if you want real-time updates)
/*
function setupRealTimeListener(regionFilter = '') {
    let playersQuery;
    const playersCollection = collection(db, 'players');
    
    if (regionFilter) {
        playersQuery = query(playersCollection, where('region', '==', regionFilter));
    } else {
        playersQuery = playersCollection;
    }

    onSnapshot(playersQuery, (snapshot) => {
        const players = [];
        snapshot.forEach((doc) => {
            players.push({ id: doc.id, ...doc.data() });
        });
        updatePlayersList(players);
    });
}

function updatePlayersList(players) {
    if (players.length === 0) {
        playersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users-slash"></i>
                <h3>No players found</h3>
                <p>Try changing your filter or add yourself as a player!</p>
            </div>
        `;
        return;
    }

    playersList.innerHTML = players.map(player => `
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
}
*/

// Form submission handler
usernameForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const region = document.getElementById('region').value;

    if (!username || !region) {
        alert('Please fill in all fields');
        return;
    }

    try {
        // Add player to Firestore
        const docRef = await addDoc(collection(db, 'players'), {
            username: username,
            region: region,
            timestamp: new Date()
        });

        console.log("Player added with ID: ", docRef.id);

        // Reset form
        usernameForm.reset();

        // Show success message
        alert(`Player ${username} from ${region} added successfully!`);

        // Reload players list
        loadPlayers(filterRegion.value);
    } catch (error) {
        console.error("Error adding player: ", error);
        alert('Error adding player. Please try again.');
    }
});

// Filter change handler
filterRegion.addEventListener('change', function () {
    loadPlayers(this.value);
    // If using real-time listener: setupRealTimeListener(this.value);
});

// Refresh button handler
refreshBtn.addEventListener('click', function () {
    loadPlayers(filterRegion.value);
});

// Initial load
loadPlayers();
// If using real-time listener: setupRealTimeListener();
