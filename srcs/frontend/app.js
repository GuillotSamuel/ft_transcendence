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
    connexion2FA: {
        template: `
            <section id="connexion-2FA-page" class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div class="row text-center w-100">
                    <div class="col-md-12">
                        <h3 class="mb-3">2FA Login</h3>
                        <form id="connexion-otp-form">
                            <div class="mb-3">
                                <label for="otp-code" class="form-label">Enter OTP code :</label>
                                <input type="text" class="form-control" id="connexion-otp-code-id" required>
                            </div>
                            <button type="button" class="btn btn-primary w-100" onclick="connexionOTP()">Validate OTP code</button>
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
                        <h2>Create a new account</h2>
                        <form id="registration-form">
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
                            <div class="mb-3">
                                <label for="register-confirm-password" class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="register-confirm-password" required>
                            </div>
                            <div id="password-error" class="text-danger d-none">Passwords do not match!</div>
                            <button type="button" onclick="registerUser()" class="btn btn-success w-100">Sign Up</button>
                        </form>
                        <p class="mt-3 text-center">Already have an account? <a href="#connexion">Log in</a></p>
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
                        <h2>You are now registred !</h2>
                        <a href="#connexion" class="btn btn-primary btn-lg mt-3">Connexion</a>
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
                        <h2>Your Profile</h2>
                        <ul class="list-group">
                            <li class="list-group-item">
                                <strong>Username:  </strong><span id="profile-userName"></span>
                            </li>
                            <li class="list-group-item">
                                <strong>Email:  </strong><span id="profile-userEmail"></span>
                            </li>
                            <li class="list-group-item">
                                <strong>2FA activated:  </strong><span id="profile-userTwoFA"></span>
                            </li>
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
                                <label for="new-password-change" class="form-label">New Password</label>
                                <input type="password" class="form-control" id="new-password-change" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirm-password-change" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="confirm-password-change" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" onclick="changePassword()">Change Password</button>
                        </form>

                        <hr class="my-4">

                        <!-- 2FA activation Section -->
                        <h3 class="mb-3">Two-Factor Authentication (2FA)</h3>
                        <p class="text-muted">Enable or disable Two-Factor Authentication for added security.</p>
                        <button id="toggle-2fa" class="btn btn-secondary w-100"></button>

                        <hr class="my-4">

                        <!-- Delete Account Section -->
                        <h3 class="text-danger">Delete Account</h3>
                        <p class="text-muted">If you want to permanently delete your account, click the button below. This action cannot be undone.</p>
                        <button id="delete-account" class="btn btn-danger w-100" onclick="location.hash = '#deleteAccount'">Delete My Account</button>
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
                        <h3 class="mb-3">Account Suppression Confirmation</h3>
                        <p class="text-muted">The account suppression is definitive.</p>
                        <button id="confirm-delete-btn" type="button" class="btn btn-primary w-100" onclick="deleteAccount()">Confirm account suppression</button>
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
                        <h3 class="mb-3">2FA Confirmation</h3>
                        <div id="qrcode" class="mb-3"></div>
                        <p class="text-muted">You need to use the Google Authenticator App on Smartphone.</p>
                        <form id="check-otp-form">
                            <div class="mb-3">
                                <label for="otp-code" class="form-label">Enter OTP code :</label>
                                <input type="text" class="form-control" id="otp-code-id" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" onclick="validateOTP()">Validate OTP code</button>
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
                        <h2 class="display-1 text-gradient fw-bold arcade-text mb-4">Play Pong!</h2>
                        <p class="lead text-muted">Challenge a friend or a random opponent and start your game!</p>
                        <!-- Canvas for the game -->
                        <div class="canvas-container p-4 rounded shadow">
                            <canvas id="pong-canvas" class="bg-dark rounded border border-light" width="800" height="600"></canvas>
                        </div>
                        <!-- Buttons for Local and Remote Game -->
                        <div class="d-flex justify-content-center gap-3 mt-4" id="gameButtonDisplay">
                            
                        </div>
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

async function checkAuthentication() {
    try {
        const response = await fetch('/api/isUserAuthentified/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        return response.ok;
    } catch (error) {
        console.error("Authentication check failed:", error);
        return false;
    }
}

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

async function navigate() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];

    if ((hash !== 'home' && hash !== 'connexion'
        && hash != 'connexion2FA' && hash !== 'registration'
        && hash !== 'registrationSuccess')
        && !(await checkAuthentication())) {
        location.hash = '#connexion';
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
        setTimeout(() => {
            toggle2FAStatus();
        }, 0);
    }
    if (hash === 'profile') {
        appDiv.innerHTML = route.template;
        setTimeout(() => {
            displayUserInfos();
        }, 0);
    }
    if (hash === 'editPage') {
        appDiv.innerHTML = route.template;
        setTimeout(() => {
            toggle2FAStatus();
        }, 0);
    }
}

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

function isPasswordSecure(password) {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
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

async function manageDisplayAuth() {
    const isAuthenticated = await checkAuthentication();
    const navbarNav = document.getElementById('navbarNav');
    const navFooter = document.getElementById('navFooter');
    const gameButtonDisplay = document.getElementById('gameButtonDisplay');

    navbarNav.innerHTML = '';
    navFooter.innerHTML = '';

    if (isAuthenticated) {
        navbarNav.innerHTML = `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#home">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#game">Game</a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#profile">Profile</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" onclick="disconnectUser()">Logout</a>
                </li>
            </ul>
        `;
        navFooter.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#game">Game</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a onclick="disconnectUser()">Logout</a></li>
        `;
        gameButtonDisplay.innerHTML = `
            <button class="btn btn-primary btn-lg" onclick="startLocalGame()">Local Game</button>
            <button class="btn btn-info btn-lg" onclick="startRemoteGame()">Remote Game</button>
        `;
    } else {
        navbarNav.innerHTML = `
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#home">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#game">Game</a>
                </li>
            </ul>
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#connexion">Connexion</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#registration">Sign up</a>
                </li>
            </ul>
        `;
        navFooter.innerHTML = `
            <li><a href="#home">Home</a></li>
            <li><a href="#game">Game</a></li>
            <li><a href="#connexion">Connexion</a></li>
            <li><a href="#registration">Sign up</a></li>
        `;
        gameButtonDisplay.innerHTML = `
            <button class="btn btn-primary btn-lg" onclick="startLocalGame()">Local Game</button>
        `;
    }
}


async function changePassword() {
    const oldPwd = document.getElementById('current-password').value;
    const changePwd = document.getElementById('new-password-change').value;
    const confirmChangePwd = document.getElementById('confirm-password-change').value;

    if (changePwd != confirmChangePwd) {
        alert('Passwords are not matching !');
        return;
    }

    if (changePwd == oldPwd) {
        alert('The current password and the new password are the same !');
        return;
    }

    if (!isPasswordSecure(changePwd)) {
        alert('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
        return;
    }

    const password = changePwd;

    try {
        const response = await fetch('/api/changePassword/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
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

function startLocalGame() {
    startGame();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);
window.addEventListener('hashchange', manageDisplayAuth);
window.addEventListener('load', manageDisplayAuth);
