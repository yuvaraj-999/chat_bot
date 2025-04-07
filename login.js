// Import database operations
const db = new Database();

// Form toggle functionality
function toggleForm() {
    const loginBox = document.querySelector('.login-box');
    const registerBox = document.querySelector('.register-box');
    
    if (loginBox.style.display === 'none') {
        loginBox.style.display = 'block';
        registerBox.style.display = 'none';
    } else {
        loginBox.style.display = 'none';
        registerBox.style.display = 'block';
    }
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMsg');

    const user = db.findUser(email, password);
    
    if (user) {
        // Store session
        db.setCurrentUser(user);
        // Prompt for API key if not already stored
        const apiKey = db.getApiKey(user.id);
        if (!apiKey) {
            const newApiKey = prompt("Please enter your OpenAI API key:");
            if (newApiKey) {
                db.saveApiKey(user.id, newApiKey);
            }
        }
        // Redirect to chat
        window.location.href = 'x.html';
    } else {
        errorMsg.textContent = 'Invalid email or password';
    }
}

// Handle registration form submission
async function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMsg = document.getElementById('regErrorMsg');

    // Validation
    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match';
        return false;
    }

    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters long';
        return false;
    }

    if (db.isEmailTaken(email)) {
        errorMsg.textContent = 'Email already registered';
        return false;
    }

    // Create new user
    const newUser = db.createUser(name, email, password);
    
    // Auto login after registration
    db.setCurrentUser(newUser);
    
    // Prompt for API key
    const apiKey = prompt("Please enter your OpenAI API key:");
    if (apiKey) {
        db.saveApiKey(newUser.id, apiKey);
    }
    
    window.location.href = 'x.html';
    return false;
}

// Check if user is already logged in
window.addEventListener('load', () => {
    const currentUser = db.getCurrentUser();
    if (currentUser) {
        window.location.href = 'x.html';
    }
});