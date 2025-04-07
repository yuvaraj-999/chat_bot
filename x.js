const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input button');
const chatbox = document.querySelector(".chatbox");

let userMessage;
const db = new Database();
const currentUser = db.getCurrentUser();
const API_KEY = currentUser ? db.getApiKey(currentUser.id) : null;

if (!API_KEY) {
    alert("API key is required for the chatbot to function. Please log in again.");
    window.location.href = 'login.html';
}

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = `<p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi;
}

const generateResponse = async (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    
    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage}]
            })
        };

        const response = await fetch(API_URL, requestOptions);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const data = await response.json();
        messageElement.textContent = data.choices[0]?.message?.content || "No response from AI";
    } catch (error) {
        console.error("Error:", error);
        messageElement.classList.add("error");
        if (error.message.includes("401")) {
            messageElement.textContent = "Invalid API key. Please refresh and enter a valid OpenAI API key.";
        } else if (error.message.includes("429")) {
            messageElement.textContent = "Too many requests. Please try again later.";
        } else {
            messageElement.textContent = "Oops! Something went wrong. Please try again!";
        }
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    
    // Clear input field
    chatInput.value = "";
    
    // Add user message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "chat-outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "chat-incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

sendChatBtn.addEventListener("click", handleChat);

// Handle Enter key press
chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChat();
    }
});

// Check authentication on page load
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(currentUser);
    document.getElementById('userInfo').textContent = `Hello, ${user.name}`;
});

// Logout functionality
function logout() {
    db.clearCurrentUser();
    window.location.href = 'login.html';
}

function cancel() {
    let chatbot = document.querySelector(".chatBot");
    if (window.getComputedStyle(chatbot).display !== "none") {
        chatbot.style.display = "none";
        let lastMsg = document.createElement("p");
        lastMsg.textContent = 'Thanks for using our Chatbot!';
        lastMsg.classList.add('lastMessage');
        document.body.appendChild(lastMsg);
    }
}