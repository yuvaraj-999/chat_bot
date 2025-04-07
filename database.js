// Database operations and user management
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.API_KEYS = JSON.parse(localStorage.getItem('api_keys')) || {};
    }

    // User operations
    findUser(email, password) {
        return this.users.find(u => u.email === email && u.password === password);
    }

    getUserById(id) {
        return this.users.find(u => u.id === id);
    }

    createUser(name, email, password) {
        const newUser = {
            id: Date.now(),
            name,
            email,
            password
        };
        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    isEmailTaken(email) {
        return this.users.some(u => u.email === email);
    }

    // API Key operations
    saveApiKey(userId, apiKey) {
        this.API_KEYS[userId] = apiKey;
        localStorage.setItem('api_keys', JSON.stringify(this.API_KEYS));
    }

    getApiKey(userId) {
        return this.API_KEYS[userId];
    }

    // Session management
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    clearCurrentUser() {
        localStorage.removeItem('currentUser');
    }
}

// Create a single instance to be used across the application
const db = new Database();