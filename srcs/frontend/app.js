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
                            <li class="list-group-item"><strong>Username:</strong><span id="profile-userName"></span></li>
                            <li class="list-group-item"><strong>Email:</strong><span id="profile-userEmail"></span></li>
                            <li class="list-group-item"><strong>2FA activated:</strong><span id="profile-userTwoFA"></span></li>
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
                                <input type="password" class="form-control" id="new-password-change" required>
                            </div>
                            <div class="mb-3">
                                <label for="confirm-password" class="form-label">Confirm New Password</label>
                                <input type="password" class="form-control" id="confirm-password-change" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100" onclick="changePassword()">Change Password</button>
                        </form>

                        <hr class="my-4">

                        <!-- 2FA activation Section -->
                        <h3 class="mb-3">Two-Factor Authentication (2FA)</h3>
                        <p class="text-muted">Enable or disable Two-Factor Authentication for added security.</p>
                        <button id="toggle-2fa" class="btn btn-secondary w-100" onclick="toggle2FA()">Enable 2FA</button>

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
    confirm2FA: {
        template: `
            <section id="confirm-2FA-page" class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <div class="row text-center w-100">
                    <div class="col-md-12">
                        <h3 class="mb-3">2FA Confirmation</h3>
                        <div id="qrcode" class="mb-3"></div>
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
                        <div class="d-flex justify-content-center gap-3 mt-4">
                            <button class="btn btn-primary btn-lg" onclick="startLocalGame()">Local Game</button>
                            <button class="btn btn-info btn-lg toDisplayWhenConnected" onclick="startRemoteGame()">Remote Game</button>
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
window.toggle2FA = toggle2FA;
window.validateOTP = validateOTP;
window.changePass = changePassword;

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

async function navigate() {
    const hash = window.location.hash.substring(1);
    const route = routes[hash];

    if ((hash === 'profile') && !(await checkAuthentication())) {
        location.hash = '#connexion';
        return;
    }

    const appDiv = document.getElementById('app');
    if (route) {
        appDiv.innerHTML = route.template;
    } else {
        appDiv.innerHTML = "<h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p>";
    }
}

async function toggle2FA() {
    try {
        const response = await fetch('/api/activate2FA/', {
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

async function toggle2FAStatus() {
    if (window.location.pathname === '/edit') {
        const button = document.getElementById('toggle-2fa');

        try {
            const response = await fetch('/api/is2FAactivate/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.text();
                if (data === 'yes') {
                    button.textContent = 'Disable 2FA';
                }
                else if (data === 'no') {
                    button.textContent = 'Enable 2FA';
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
            location.hash = '#game';
        } else {
            alert(`Error: ${data.message || 'Login failed'}`);
        }
    } catch (error) {
        alert('Network error: Unable to login');
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

async function displayUserInfos() {
    if (window.location.pathname === '/profile') {
        try {
            const response = await fetch('/api/userInfos', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                document.getElementById('profile-userName').textContent = userName;
                document.getElementById('profile-userEmail').textContent = email;
                document.getElementById('profile-userTwoFA').textContent = twoFA ? 'Enabled' : 'Disabled';
            } else {
                alert('Error: Unable to get user infos');
                return;
            }
        } catch (error) {
            alert('UserInfos error: Unable to get user infos');
        }
    }
}


async function manageDisplayAuth() {
    const isAuthenticated = await checkAuthentication();

    if (isAuthenticated == true) {
        document.querySelectorAll('.toHideWhenConnected').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.toDisplayWhenConnected').forEach(element => {
            element.style.display = '';
        });
    } else {
        document.querySelectorAll('.toHideWhenConnected').forEach(element => {
            element.style.display = '';
        });

        document.querySelectorAll('.toDisplayWhenConnected').forEach(element => {
            element.style.display = 'none';
        });
    }
}

async function changePassword() {
    const changePwd = document.getElementById('new-password-change').value;
    const confirmChangePwd = document.getElementById('confirm-password-change').value;

    if (changePwd != confirmChangePwd) {
        alert('Passwords are not matching !');
        return;
    }

    if (!isPasswordSecure(changePwd)) {
        alert('Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.');
        return;
    }

    try {
        const response = await fetch('/api/changePassword/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();
        if (response.ok) {
            location.hash = '#editPage';
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
            location.hash = '#home';
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
window.addEventListener('hashchange', toggle2FAStatus);
window.addEventListener('load', toggle2FAStatus);
window.addEventListener('hashchange', displayUserInfos);
window.addEventListener('load', displayUserInfos);
window.addEventListener('hashchange', manageDisplayAuth);
window.addEventListener('load', manageDisplayAuth);