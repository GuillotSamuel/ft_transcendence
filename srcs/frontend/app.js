import { startGame } from './local_game/game.js';

const routes = {
    home: {
        template: `
            <section id="home" class="container mt-5 pt-5">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h1>Welcome to Online Pong Game!</h1>
                        <p class="lead">Play against friends or random opponents online. Are you ready to start?</p>
                        <a href="#game" class="btn btn-primary btn-lg mt-3">Start Game</a>
                    </div>
                </div>
            </section>
        `
    },
    connexion: {
        template: `
            <section id="connexion" class="container mt-5 pt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <h2>Login to your account</h2>
                        <form>
                            <div class="mb-3">
                                <label for="login-username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="login-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="login-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="login-password" required>
                            </div>
                            <button type="button" onclick="loginUser()" class="btn btn-primary w-100">Log In</button>
                        </form>
                        <p class="mt-3 text-center">Don't have an account? <a href="#registration">Sign up</a></p>
                    </div>
                </div>
            </section>
        `
    },
    registration: {
        template: `
            <section id="registration" class="container mt-5 pt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <h2>Create a new account</h2>
                        <form>
                            <div class="mb-3">
                                <label for="register-username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="register-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="register-email" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="register-password" required>
                            </div>
                            <button type="button" onclick="registerUser()" class="btn btn-success w-100">Sign Up</button>
                        </form>
                        <p class="mt-3 text-center">Already have an account? <a href="#connexion">Log in</a></p>
                    </div>
                </div>
            </section>
        `
    },
    profile: {
        template: `
            <section id="profile" class="container mt-5 pt-5">
                <div class="row">
                    <div class="col-md-4">
                        <h2>Your Profile</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Username:</strong> User123</li>
                            <li class="list-group-item"><strong>Email:</strong> user123@example.com</li>
                        </ul>
                        <button class="btn btn-warning mt-3 w-100" onclick="location.hash = '#editPage'">Edit Profile</button>
                        <button class="btn btn-danger mt-2 w-100" onclick="disconnectUser()">Log Out</button>
                    </div>
                </div>
            </section>
        `
    },
    editPage: {
        template: `
            <section id="edit-page" class="container mt-5 pt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6">
                        <h2>Edit Your Profile</h2>

                        <!-- Change Password Form -->
                        <form id="change-password-form">
                            <div class="mb-3">
                                <label for="current-password" class="form-label">Current Password</label>
                                <input type="password" class="form-control" id="current-password" required>
                            </div>
                            <div class="mb-3">
                                <label for="new-password" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="new-password" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirm-password" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="confirm-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Change Password</button>
                        </form>

                        <hr class="my-4">

                        <!-- Delete Account Section -->
                        <h3 class="text-danger">Delete Account</h3>
                        <p class="text-muted">If you want to permanently delete your account, click the button below. This action cannot be undone.</p>
                        <button id="delete-account" class="btn btn-danger w-100">Delete My Account</button>
                    </div>
                </div>
            </section>
        `
    },
    game: {
        template: `
            <section id="game" class="container mt-5 pt-5">
                <div class="row text-center">
                    <div class="col-md-12">
                        <!-- Styled heading -->
                        <h2 class="display-1 text-gradient fw-bold arcade-text mb-4">Play Pong!</h2>
                        <p class="lead text-muted">Challenge a friend or a random opponent and start your game!</p>
                        <!-- Canvas for the game -->
                        <div class="canvas-container p-4 rounded shadow">
                            <canvas id="pong-canvas" class="bg-dark rounded border border-light" width="800" height="600"></canvas>
                        </div>
                        <!-- Buttons for Local and Remote Game -->
                        <div class="d-flex justify-content-center gap-3 mt-4">
                            <button class="btn btn-primary btn-lg" onclick="startLocalGame()">Local Game</button>
                            <button class="btn btn-info btn-lg" onclick="startRemoteGame()">Remote Game</button>
                        </div>
                    </div>
                </div>
            </section>
        `
    }
};




function navigate() {
    const hash = window.location.hash.substring(1) || 'home';
    const route = routes[hash];

    // if ((hash === 'profile' || hash === 'editPage' || hash === 'game') && !isAuthenticated()) {
    //     alert('Please log in to access this page.');
    //     location.hash = '#connexion';
    //     return;
    // }

    const appDiv = document.getElementById('app');
    if (route) {
        appDiv.innerHTML = route.template;
    } else {
        appDiv.innerHTML = "<h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p>";
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);

// Expose functions to the global scope
window.startLocalGame = startLocalGame;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.disconnectUser = disconnectUser;

function isAuthenticated() {
    return localStorage.getItem('authToken') !== null; // to change the auth token
}


async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Login successful!');
            location.hash = '#profile';
        } else {
            alert(`Error: ${data.message || 'Login failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to login');
    }
}

async function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            location.hash = '#connexion';
        } else {
            alert(`Error: ${data.message || 'Registration failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to register');
    }
}

async function logoutUser() {
    const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include'
    });
    alert(response.ok ? 'Disconnexion success!' : `Error: ${await response.text()}`);
}


async function disconnectUser() {
    try {
        const response = await fetch('http://localhost:8000/api/logout/', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            localStorage.removeItem('authToken'); // to change
            alert('Successfully logged out!');
            location.hash = '#home';
        } else {
            alert(`Error: ${await response.text()}`);
        }
    } catch (error) {
        alert('Network error: Unable to logout');
    }
}

function startLocalGame() {
    startGame();
}