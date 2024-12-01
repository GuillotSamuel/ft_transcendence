import { startRemoteGame} from './remote_game/websocket.js';
import { disconnectGame} from './remote_game/disconnect.js';
import { tournamentGame } from './local_game/tournament/init.js';
import { startLocalGame, startCustomGame } from './local_game/gameManager.js';
import { drawFindGameScreen } from './remote_game/find_return_button.js';


const routes = {
    home: {
        template: `
            <section id="home" class="container mt-5 pt-5">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h1 data-translate="welcome-home-title"></h1>
                        <p class="lead" data-translate="presentation-home-text"></p>
                        <a href="#game" class="btn btn-primary btn-lg mt-3" data-translate="startGame-home-button"></a>
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
                        <h2 data-translate="login-connexion-title"></h2>
                        <form>
                            <div class="mb-3">
                                <label for="login-username" class="form-label" data-translate="username-connexion-label"></label>
                                <input type="text" class="form-control" id="login-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="login-password" class="form-label" data-translate="password-connexion-label"></label>
                                <input type="password" class="form-control" id="login-password" required>
                            </div>
                            <button type="button" onclick="loginUser()" class="btn btn-primary w-100 mb-3" data-translate="login-connexion-button"></button>
                        </form>

                        <button type="button" class="btn btn-primary w-100 mb-3" onclick="login42()">Login 42</button>
                        <p class="mt-3 text-center"><div data-translate="signUp-connexion-text"></div> <a href="#registration" data-translate="signUp-connexion-link"></a></p>
                    </div>
                </div>
            </section>
        `
    },
    connexion2FA: {
        template: `
            <section id="connexion-2FA-page" class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div class="row text-center w-100">
                    <div class="col-md-12">
                        <h3 class="mb-3" data-translate="2fa-connexion2fa-title"></h3>
                        <form id="connexion-otp-form">
                            <div class="mb-3">
                                <label for="otp-code" class="form-label" data-translate="enterOtp-connexion2fa-label"></label>
                                <input type="text" class="form-control" id="connexion-otp-code-id" required>
                            </div>
                            <button type="button" class="btn btn-primary w-100" onclick="connexionOTP()" data-translate="validate-connexion2fa-button"></button>
                        </form>
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
                        <h2 data-translate="create-registration-title"></h2>
                        <form id="registration-form">
                            <div class="mb-3">
                                <label for="register-username" class="form-label" data-translate="userName-registration-label"></label>
                                <input type="text" class="form-control" id="register-username" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-email" class="form-label" data-translate="email-registration-label"></label>
                                <input type="email" class="form-control" id="register-email" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-password" class="form-label" data-translate="password-registration-label"></label>
                                <input type="password" class="form-control" id="register-password" required>
                            </div>
                            <div class="mb-3">
                                <label for="register-confirm-password" class="form-label" data-translate="passwordConfirmation-registration-label"></label>
                                <input type="password" class="form-control" id="register-confirm-password" required>
                            </div>
                            <div id="password-error" class="text-danger d-none" data-translate="passwordError-registration-label"></div>
                            <button type="button" onclick="registerUser()" class="btn btn-success w-100" data-translate="signUp-registration-button"></button>
                        </form>
                        <p class="mt-3 text-center"><div data-translate="logIn-registration-text"></div><a href="#connexion" data-translate="logIn-registration-link"></a></p>
                    </div>
                </div>
            </section>
        `
    },
    registrationSuccess: {
        template: `
            <section id="registrationSuccess" class="container mt-5 pt-5">
                <div class="row justify-content-center">
                    <div class="col-md-6  text-center">
                        <h2 data-translate="title-registrationSuccess-title"></h2>
                        <a href="#connexion" class="btn btn-primary btn-lg mt-3" data-translate="connexion-registrationSuccess-button"></a>
                    </div>
                </div>
            </section>
        `
    },
    profile: {
        template: `
            <section id="profile" class="container mt-5 pt-5">
                <div class="row justify-content-center align-items-center">
                    <div class="col-md-6 text-center">
                        <h2 data-translate="title-profile-title"></h2>
                        <div id="avatar-container" style="width: 100px; height: 100px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                            <img id="current-avatar" alt="User Avatar" width="100" height="100" style="object-fit: cover;"/>
                        </div>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <strong data-translate="username-profile-text"></strong><span id="profile-userName"></span>
                            </li>
                            <li class="list-group-item">
                                <strong data-translate="email-profile-text"></strong><span id="profile-userEmail"></span>
                            </li>
                            <li class="list-group-item">
                                <strong data-translate="2fa-profile-text"></strong><span id="profile-userTwoFA"></span>
                            </li>
                        </ul>
                        <button class="btn btn-warning mt-3 w-100" onclick="location.hash = '#editPage'" data-translate="edit-profile-button"></button>
                        <button class="btn btn-danger mt-2 w-100" onclick="disconnectUser()" data-translate="logOut-profile-button"></button>
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
                        <h2 data-translate="title-editPage-title"></h2>

                        <!-- Change Avatar Section -->
                        <div id="avatar-container" style="width: 100px; height: 100px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                            <img id="current-avatar" alt="User Avatar" width="100" height="100" style="object-fit: cover;"/>
                        </div>
                        <input type="file" id="new-avatar" accept="image/*" onchange="previewAvatar(event)">
                        <button id="submit-avatar" class="btn btn-primary w-100 mt-2" onclick="changeAvatar()" data-translate="changeAvatar-editPage-button">Upload Avatar</button>

                        <hr class="my-4">

                        <!-- Change Password Form -->
                        <form id="change-password-form">
                            <div class="mb-3">
                                <label for="current-password" class="form-label" data-translate="currentPassword-editPage-label"></label>
                                <input type="password" class="form-control" id="current-password" required>
                            </div>
                            <div class="mb-3">
                                <label for="new-password-change" class="form-label" data-translate="newPassword-editPage-label"></label>
                                <input type="password" class="form-control" id="new-password-change" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirm-password-change" class="form-label" data-translate="confirmNewPassword-editPage-label"></label>
                                <input type="password" class="form-control" id="confirm-password-change" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" onclick="changePassword()" data-translate="changePassword-profile-button"></button>
                        </form>

                        <hr class="my-4">

                        <!-- 2FA activation Section -->
                        <h3 class="mb-3" data-translate="2fa-editPage-title"></h3>
                        <p class="text-muted" data-translate="enableDisable-editPage-text"></p>
                        <button id="toggle-2fa" class="btn btn-secondary w-100"></button>

                        <hr class="my-4">

                        <!-- Delete Account Section -->
                        <h3 class="text-danger" data-translate="delete-editPage-title"></h3>
                        <p class="text-muted" data-translate="delete-editPage-text"></p>
                        <button id="delete-account" class="btn btn-danger w-100" onclick="location.hash = '#deleteAccount'" data-translate="delete-profile-button"></button>
                    </div>
                </div>
            </section>
        `
    },
    deleteAccount: {
        template: `
            <section id="confirm-delete-account-page" class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div class="row text-center w-100">
                    <div class="col-md-12">
                        <h3 class="mb-3" data-translate="title-deleteAccount-title"></h3>
                        <p class="text-muted" data-translate="suppresion-deleteAccount-text"></p>
                        <button id="confirm-delete-btn" type="button" class="btn btn-primary w-100" onclick="deleteAccount()" data-translate="suppresion-deleteAccount-button"></button>
                    </div>
                </div>
            </section>
        `
    },
    confirm2FA: {
        template: `
            <section id="confirm-2FA-page" class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div class="row text-center w-100">
                    <div class="col-md-12">
                        <h3 class="mb-3" data-translate="title-confirm2FA-title"></h3>
                        <div id="qrcode" class="mb-3"></div>
                        <p class="text-muted" data-translate="authentificator-confirm2FA-text"></p>
                        <form id="check-otp-form">
                            <div class="mb-3">
                                <label for="otp-code" class="form-label" data-translate="enterCode-confirm2FA-text"></label>
                                <input type="text" class="form-control" id="otp-code-id" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" onclick="validateOTP()" data-translate="validateCode-confirm2FA-button"></button>
                        </form>
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
                        <h2 class="display-1 text-gradient fw-bold arcade-text mb-4" data-translate="title-game-title"></h2>
                        <p class="lead text-muted" data-translate="presentation-game-text"></p>
                        <!-- Canvas for the game -->
                        <div class="canvas-container p-4 rounded shadow">
                            <canvas id="pong-canvas" class="bg-dark rounded border border-light" width="600" height="400"></canvas>
                        </div>
                        <!-- Buttons for Local and Remote Game -->
                        <div class="d-flex justify-content-center gap-3 mt-4" id="gameButtonDisplay"></div>
                        
                    </div>
                </div>
            </section>
        `
    },
    friend: {
        template: `
            <section id="friend" class="container mt-5 pt-5">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h2 class="display-1 text-gradient fw-bold arcade-text mb-4" data-translate="title-friend-title"></h2>
                        <div class="card p-4 mb-4 bg-light">
                            <div class="card-body">
                                <h3 class="mb-3" data-translate="adding-friend-title"></h3>
                                <input type="text" id="friend-username-input" class="form-control mb-3" placeholder="Enter friend's username">
                                <button id="add-friend-button" class="btn btn-primary" onclick="addingFriend()" data-translate="adding-friend-button"></button>
                            </div>
                        </div>
                        <h3 class="mb-3" data-translate="list-friend-title"></h3>
                        <div id="friend-list"></div>
                    </div>
                </div>
            </section>
        `
    },
    statsHistory: {
        template: `
            <section id="statsHistory" class="container mt-5 pt-5">
                <div class="row text-center">
                    <div class="col-md-12">
                        <h2 class="display-1 text-gradient fw-bold arcade-text mb-4" data-translate="title-statsHistory-title"></h2>
                        <div class="card p-4 mb-4 bg-light">
                            <div class="card-body">
                                <h3 class="mb-3" data-translate="stats-statsHistory-title"></h3>
                                <div id="user-stats"></div>
                            </div>
                        </div>
                        <h3 class="mb-3" data-translate="history-statsHistory-title"></h3>
                        <div id="user-history"></div>
                    </div>
                </div>
            </section>
        `
    }
};


window.startLocalGame = startLocalGame;
window.registerUser = registerUser;
window.loginUser = loginUser;
window.disconnectUser = disconnectUser;
window.enable2FA = enable2FA;
window.disable2FA = disable2FA;
window.toggle2FAStatus = toggle2FAStatus;
window.validateOTP = validateOTP;
window.changePassword = changePassword;
window.connexionOTP = connexionOTP;
window.deleteAccount = deleteAccount;
window.startRemoteGame = startRemoteGame;
window.addingFriend = addingFriend;
window.changeAvatar = changeAvatar;
window.login42 = login42;
window.disconnectGame = disconnectGame;
window.drawFindGameScreen = drawFindGameScreen;
window.displaySecondaryButtons = displaySecondaryButtons;
window.manageDisplayGame = manageDisplayGame;
window.startCustomGame = startCustomGame;
window.tournamentGame = tournamentGame;

/* Utils */

function isPasswordSecure(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}


/* Authentication & User Management */

async function checkAuthentication() {
    try {
        const response = await fetch('/api/isUserAuthentified/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const data = await response.json();
            return data.Authentication === 'yes';
        }

        return false;
    } catch (error) {
        console.error("Authentication check failed:", error);
        return false;
    }
}

async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch('/api/login/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            if (await is2FAactivate() === true) {
                location.hash = '#connexion2FA';
            }
            else {
                location.hash = '#game';
            }

        } else {
            alert(`Error: ${data.message || 'Login failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to login');
    }
}

async function disconnectUser() {
    const response = await fetch('/api/logout/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    });
    if (!response.ok) {
        alert('Error while disconnecting')
    }
    location.hash = "#home";
}

async function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords are not matching !');
        return;
    }

    if (!isPasswordSecure(password)) {
        alert('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
        return;
    }

    try {
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            location.hash = '#registrationSuccess';
        } else {
            alert(`Error: ${data.message || 'Registration failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to register');
    }
}

async function deleteAccount() {
    try {
        const response = await fetch('/api/deleteUser/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            location.hash = '#home';
        }
        else {
            alert('Error: Account deletion failed');
        }
    } catch (error) {
        alert('Error: Unable to delete account');
    }
}

async function changePassword() {
    const oldPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password-change').value;
    const confirmChangePwd = document.getElementById('confirm-password-change').value;

    if (newPwd != confirmChangePwd) {
        alert('Passwords are not matching !');
        return;
    }

    if (!isPasswordSecure(newPwd)) {
        alert('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
        return;
    }

    try {
        const response = await fetch('/api/changePassword/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({oldPwd, newPwd}),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            alert('Password has been changed successfuly !')
        } else {
            alert(`Error: ${data.message || 'Change password failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to change the password');
    }
}


/* 2FA (Two-Factor Authentication) */

async function enable2FA() {
    try {
        const response = await fetch('/api/enable2FA/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const QRURL = data.provisioning_uri;

            location.hash = '#confirm2FA';
            setTimeout(() => {
                const qrCodeElement = document.getElementById('qrcode');
                try {
                    new QRCode(qrCodeElement, {
                        text: QRURL,
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
                catch (error) {
                    console.error('Error generating QR code with qrcode.js:', error);
                    alert('Error generating QR code');
                }
            }
                , 500);
        }
        else {
            console.error('Provisioning URI not found in the response');
            alert('Error: Provisioning URI not found');
        }
    }
    catch (error) {
        console.error('2FA error:', error);
        alert('2FA error: Unable to change 2FA status');
    }
}

async function disable2FA() {
    try {
        const response = await fetch('/api/disable2FA/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (response.ok) {
            alert('2FA disabled successfully');
        } else {
            alert('Error disabling 2FA');
        }
    } catch (error) {
        alert('Network error while disabling 2FA');
    }
}

async function is2FAactivate() {
    try {
        const response = await fetch('/api/is2FAactivate/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            if (data["2FA_activated"] === 'yes') {
                return (true);
            }
            else if (data["2FA_activated"] === 'no') {
                return (false);
            }
            else {
                alert('Error: Unknown 2FA status');
            }
        }
        else {
            alert('Error: error while fetching 2FA status')
        }
    }
    catch (error) {
        alert('2FA error: Unable to get 2FA status')
    }
}

async function toggle2FAStatus() {
    const button = document.getElementById('toggle-2fa');

    if (!button) {
        console.error("2FA button not found in the DOM");
        return;
    }

    try {
        const response = await fetch('/api/is2FAactivate/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            if (data["2FA_activated"] === 'yes') {
                button.textContent = 'Disable 2FA';
                button.onclick = async () => {
                    await disable2FA();
                    toggle2FAStatus();
                };
            }
            else if (data["2FA_activated"] === 'no') {
                button.textContent = 'Enable 2FA';
                button.onclick = async () => {
                    await enable2FA();
                    toggle2FAStatus();
                };
            }
            else {
                alert('Error: Unknown 2FA status');
            }
        }
        else {
            alert('Error: error while fetching 2FA status')
        }
    }
    catch (error) {
        alert('2FA error: Unable to get 2FA status')
    }
}

async function connexionOTP() {
    const otp = document.getElementById('connexion-otp-code-id').value;

    try {
        const response = await fetch('/api/login2FA/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp }),
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            location.hash = "#game";
        }
        else {
            alert('Wrong 2FA code');
            location.hash = "#connexion";
        }
    }
    catch (error) {
        alert('Error: OTP connexion failed');
    }
}


/* Profile & User Information */

async function displayUserInfos() {
    try {
        const response = await fetch('/api/infosUser/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            creadentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            const userName = data["username"];
            const email = data["email"];
            const twoFA = data["2FA_activated"];

            document.getElementById('profile-userName').textContent = userName;
            document.getElementById('profile-userEmail').textContent = email;
            document.getElementById('profile-userTwoFA').textContent = twoFA === 'yes' ? 'Enabled' : 'Disabled';
        } else {
            alert('Error fetching user info');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error while fetching user information');
    }
}

async function validateOTP() {

    const otp = document.getElementById('otp-code-id').value;

    try {
        const response = await fetch('/api/confirm2FA/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp })
        });

        const data = await response.json();
        if (response.ok) {
            location.hash = '#editPage';
        } else {
            alert("Invalid code OTP ! Try again");
        }
    } catch (error) {
        alert('Network error: Unable to check OTP code');
    }
}


/* Language management */

function translatePage(data) {
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute("data-translate");
        if (data[key]) {
            element.innerText = data[key];
        } else {
            console.warn(`Error : Missing translation for key: ${key}`);
        }
    });
}

function loadLanguage(lang) {
    fetch(`./translations/${lang}.json`)
        .then(response => response.json())
        .then(data => {
            translatePage(data);
        })
        .catch(err => console.error("Error while loading the language:", err));
}

function changeLanguage(language) {
    loadLanguage(language);
    localStorage.setItem("language", language);
}

/* Page Management */

async function manageDisplayGame() {
    const isAuthenticated = await checkAuthentication();
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    gameButtonDisplay.innerHTML = '';

    if (isAuthenticated) {
        gameButtonDisplay.innerHTML = `
            <button id="local-button" class="btn btn-primary btn-lg" onclick="displaySecondaryButtons()" data-translate="game-local-button">Local Game</button>
            <button id="remote-button" class="btn btn-info btn-lg" onclick="drawFindGameScreen()" data-translate="game-remote-button">Remote Game</button>
            <button id="disconnect-button" class="btn btn-danger btn-lg" onclick="disconnectGame()" data-translate="game-disconnect-button" style="display: none;">Disconnect</button>
        `;
    } else {
        gameButtonDisplay.innerHTML = `
            <button class="btn btn-primary btn-lg" onclick="displaySecondaryButtons()" data-translate="game-local-button">Local Game</button>
        `;
    }
}

export function displaySecondaryButtons() {
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    gameButtonDisplay.innerHTML = `
        <button class="btn btn-success btn-lg" onclick="startLocalGame()">Quick Start</button>
        <button class="btn btn-warning btn-lg" onclick="startCustomGame()">Custom Game</button>
        <button class="btn btn-info btn-lg" onclick="tournamentGame()">Tournament</button>
        <button class="btn btn-secondary btn-lg" onclick="manageDisplayGame()">Return</button>
    `;
}

async function navigate() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];

    const isConnected = await checkAuthentication();

    if ((hash !== 'home' && hash !== 'connexion'
        && hash !== 'connexion2FA' && hash !== 'registration'
        && hash !== 'registrationSuccess' && hash !== 'game'
        && hash !== '')
        && !isConnected) {
        location.hash = '#connexion';
        return;
    }

    if ((hash === 'connexion' || hash === 'connexion2FA'
        || hash == 'regitration' || hash == 'registrationSuccess')
        && isConnected) {
            location.hash = '#home';
            return;
        }

    const appDiv = document.getElementById('app');
    if (route) {
        appDiv.innerHTML = route.template;
    } else {
        appDiv.innerHTML = "<h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p>";
    }

    if (hash === 'editPage') {
        appDiv.innerHTML = route.template;
        await toggle2FAStatus();
        await getAvatar();
    }
    if (hash === 'profile') {
        appDiv.innerHTML = route.template;
        await displayUserInfos();
        await getAvatar();
    }
    if (hash === 'game') {
        appDiv.innerHTML = route.template;
        await manageDisplayGame();
    }
    if (hash === 'friend') {
        appDiv.innerHTML = route.template;
        await listFriend();
    }
    if (hash === 'statsHistory') {
        appDiv.innerHTML = route.template;
        await statsHistoryDisplay();
    }
}

async function manageDisplayAuth() {
    const isAuthenticated = await checkAuthentication();
    const navbarNav = document.getElementById('navbarNav');
    const navFooter = document.getElementById('navFooter');

    navbarNav.innerHTML = '';
    navFooter.innerHTML = '';

    if (isAuthenticated) {
        navbarNav.innerHTML = `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#home" data-translate="home-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#game" data-translate="game-navbar-button"></a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
            <li class="nav-item">
                    <a class="nav-link" href="#friend" data-translate="friends-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#statsHistory" data-translate="statsHistory-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#profile" data-translate="profile-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" onclick="disconnectUser()" data-translate="logout-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <select id="language-selector">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ar">عربي</option>
                        <option value="ru">Русский</option>
                    </select>
                </li>
            </ul>
        `;
        navFooter.innerHTML = `
            <li><a href="#home" data-translate="home-footer-button"></a></li>
            <li><a href="#game" data-translate="game-footer-button"></a></li>
            <li><a href="#friend" data-translate="friend-footer-button"></a></li>
            <li><a href="#statsHistory" data-translate="statsHistory-footer-button"></a></li>
            <li><a href="#profile" data-translate="profile-footer-button"></a></li>
            <li><a onclick="disconnectUser()" data-translate="logout-footer-button"></a></li>
        `;
    } else {
        navbarNav.innerHTML = `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#home" data-translate="home-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#game"  data-translate="game-navbar-button"></a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#connexion" data-translate="connexion-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#registration" data-translate="registration-navbar-button"></a>
                </li>
                <li class="nav-item">
                    <select id="language-selector">
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ja">日本語</option>
                        <option value="ar">عربي</option>
                        <option value="ru">Русский</option>
                    </select>
                </li>
            </ul>
        `;
        navFooter.innerHTML = `
            <li><a href="#home" data-translate="home-footer-button"></a></li>
            <li><a href="#game" data-translate="game-footer-button"></a></li>
            <li><a href="#connexion" data-translate="connexion-footer-button"></a></li>
            <li><a href="#registration" data-translate="registration-footer-button"></a></li>
        `;
    }

    const languageSelect = document.getElementById('language-selector');
    if (languageSelect) {
        languageSelect.addEventListener('change', function () {
            const selectedLanguage = this.value;
            changeLanguage(selectedLanguage);
        });
    } else {
        console.log("Error: language-selector id not found");
    }
}



/* Event listener */

window.addEventListener('load', async () => {
    await navigate();
    await manageDisplayAuth();

    const savedLanguage = localStorage.getItem('language') || 'en';
    localStorage.setItem('language', savedLanguage);
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }
    changeLanguage(savedLanguage);
});

window.addEventListener('hashchange', async () => {
    await navigate();
    await manageDisplayAuth();

    const savedLanguage = localStorage.getItem('language') || 'en';
    localStorage.setItem('language', savedLanguage);
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.value = savedLanguage;
    }
    changeLanguage(savedLanguage);
});

/* Friends */

async function addingFriend() {
    const friend_id = document.getElementById('friend-username-input').value;

    if (!friend_id) {
        alert('Please enter a username.');
        return;
    }

    try {
        const response = await fetch('/api/addFriend/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friend_id }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.detail === 'yes') {
                document.getElementById('friend-username-input').value = '';
                listFriend();
            } else {
                alert(data.detail);
            }
        } else {
            const errorData = await response.json();
            alert(errorData.detail || 'Failed to add friend. Please try again.');
        }
    } catch (error) {
        console.error("Adding friend failed:", error);
        alert('Network error: Unable to add friend.');
    }
}

async function removeFriend(friendUserName) {
    try {
        const response = await fetch('/api/removeFriend/', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ friendUserName }),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.detail === 'yes') {
                listFriend();
            } else {
                alert(`${friendUserName} not found.`);
            }
        } else {
            alert('Failed to remove friend. Please try again.');
        }
    } catch (error) {
        console.error("Removing friend failed:", error);
        alert('Network error: Unable to remove friend.');
    }
}

async function displayFriendsInfos(friends) {
    const friendList = document.getElementById('friend-list');
    friendList.innerHTML = '';

    friends.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.classList.add('card', 'mb-3');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'justify-content-between', 'align-items-center');

        const friendName = document.createElement('span');
        friendName.textContent = friend;
        cardBody.appendChild(friendName);

        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-danger');
        removeButton.textContent = 'Remove Friend';
        removeButton.onclick = () => removeFriend(friend);
        cardBody.appendChild(removeButton);

        friendItem.appendChild(cardBody);

        friendList.appendChild(friendItem);
    });
}

async function listFriend() {
    try {
        const response = await fetch('/api/listFriends/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            alert('Failed to fetch friends list.');
            return;
        }

        const data = await response.json();

        displayFriendsInfos(data.friends);
    } catch (error) {
        console.error('Getting friend list failed: ', error);
        alert('Network error: Unable to get friend list.');
    }
}


/* Avatar */

async function changeAvatar() {
    const fileInput = document.getElementById('new-avatar');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select an avatar file!');
        return;
    }

    const avatar = new FormData();
    avatar.append('avatar', fileInput.files[0]);

    try {
        const response = await fetch('/api/addAvatar/', {
            method: 'POST',
            body: avatar,
            credentials: 'include'
        });

        const data = await response.json();
        if (response.ok) {
            alert('Avatar has been changed successfuly !');
             // navigate();
        } else {
            alert(`Error: ${data.message || 'Change avatar failed'}`);
        }
    } catch (error) {
        console.error('Error posting avatar:', error);
        alert('Network error: Unable to change the avatar');
    }
}

async function getAvatar() {
    try {
        const response = await fetch('/api/getAvatar/', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();

            if (data.avatarUrl) {
                document.getElementById('current-avatar').src = data.avatarUrl;
            } else {
                alert('Avatar URL not found in the response');
            }
        } else {
            alert('Error fetching user avatar');
        }
    } catch (error) {
        console.error('Error fetching avatar:', error);
        alert('Network error: Unable to get the avatar');
    }
}

async function login42() {
    try {
        const response = await fetch('/api/loginWith42/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = data.authorization_url;
        } else {
            console.error('Failed to fetch authorization URL:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/* Game */

async function statsHistoryDisplay() {
    try {
        const response = await fetch('/api/matchsDetails/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            
            const userStatsDiv = document.getElementById('user-stats');
            userStatsDiv.innerHTML = `
            <p><strong>Wins:</strong> ${data.win}</p>
            <p><strong>Losses:</strong> ${data.lose}</p>`;

            const userHistoryDiv = document.getElementById('user-history');
            if (data.matchs.length > 0) {
                const historyHTML = data.matchs.map(match => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <p><strong>Player 1:</strong> ${match.player1}</p>
                            <p><strong>Player 2:</strong> ${match.player2}</p>
                            <p><strong>Score:</strong> ${match.p1_score} - ${match.p2_score}</p>
                            <p><strong>Winner:</strong> ${match.winner}</p>
                            <p><strong>Date:</strong> ${new Date(match.date).toLocaleString()}</p>
                        </div>
                    </div>
                `).join('');
                userHistoryDiv.innerHTML = historyHTML;
            } else {
                userHistoryDiv.innerHTML = '<p>No matches played yet.</p>';
            }
        }
    } catch (error) {
        console.error('Error: ', error);
    }
}