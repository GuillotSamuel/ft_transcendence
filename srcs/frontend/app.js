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
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" required>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Log In</button>
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
                                <label for="newUsername" class="form-label">Username</label>
                                <input type="text" class="form-control" id="newUsername" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" required>
                            </div>
                            <div class="mb-3">
                                <label for="newPassword" class="form-label">Password</label>
                                <input type="password" class="form-control" id="newPassword" required>
                            </div>
                            <button type="submit" class="btn btn-success w-100">Sign Up</button>
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
                        <button class="btn btn-danger mt-2 w-100">Log Out</button>
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
                        <h2>Play Pong!</h2>
                        <p class="lead">Enjoy a game of Pong against a friend or a random opponent.</p>
                        <!-- Placeholder for the game itself -->
                        <div id="pong-game" class="bg-light border rounded mb-3" style="width: 100%; height: 400px;">
                            <!-- Actual game rendering would go here -->
                            <p class="text-muted">The game will appear here!</p>
                        </div>
                        <button class="btn btn-danger w-100" onclick="startNewGame()">Start New Game</button>
                    </div>
                </div>
            </section>

        `
    }
};

function navigate() {
    const hash = window.location.hash.substring(1) || 'home';
    const route = routes[hash];

    const appDiv = document.getElementById('app');
    if (route) {
        appDiv.innerHTML = route.template;
    } else {
        appDiv.innerHTML = "<h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p>";
    }
}

window.addEventListener('hashchange', navigate);
window.addEventListener('load', navigate);