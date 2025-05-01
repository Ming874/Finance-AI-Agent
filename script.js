// --- DOM Elements ---
const chatBoxContainer = document.getElementById("chatBoxContainer");
const chatBoxContent = document.getElementById("chatBoxContent");
const typing = document.getElementById("typing");
const userInput = document.getElementById("userInput");
const htmlElement = document.documentElement;
const themeToggler = document.getElementById('theme-toggler');
const themeIcon = themeToggler.querySelector('i');
const currentYearSpan = document.getElementById('current-year');
const commandSuggestions = document.getElementById('commandSuggestions');

// --- Constants & State ---
const LOCAL_STORAGE_KEY = 'themePreferenceFinAgent';
const N8N_WEBHOOK_URL = "https://mingcc.app.n8n.cloud/webhook/ac662654-0156-44d6-ad50-c68e7a7a2355";
const USER_ID_STORAGE_KEY = 'finAgentUserId';
const commands = [
    { name: "/help", description: "Show commands list" },
    { name: "/clear", description: "Clear the chat history" },
    { name: "/theme", description: "Toggle light/dark theme" },
    { name: "/memory", description: "Let LLM memory this msg (施工中...)" },
    { name: "/settings", description: "Adjust AI settings (施工中...)" },
];
let selectedSuggestionIndex = -1;
let blurTimeout;
let userId;

// --- 新增 / 獲取 User ID: 記憶管理 ---
function getOrCreateUserId() {
    let storedUserId = localStorage.getItem(USER_ID_STORAGE_KEY);
    if (!storedUserId) {
        storedUserId = crypto.randomUUID();     // 現代瀏覽器內建的標準方法，用於生成 UUID
        localStorage.setItem(USER_ID_STORAGE_KEY, storedUserId);
        console.log("Generated and saved new User ID:", storedUserId);
    } else {
        console.log("Retrieved existing User ID:", storedUserId);
    }
    return storedUserId;
}
userId = getOrCreateUserId(); // 在腳本加載時獲取或創建 User ID

// --- 版權聲明年分 ---
currentYearSpan.textContent = new Date().getFullYear();

// --- 亮暗主題切換功能 ---
function getPreferredTheme() { return localStorage.getItem(LOCAL_STORAGE_KEY) || 'light'; }
function applyTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    themeIcon.classList.replace(theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill', theme === 'dark' ? 'bi-moon-stars-fill' : 'bi-sun-fill');
    themeToggler.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    updateScrollbarColors();
}
function setTheme(theme) {
    applyTheme(theme);
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
}
function updateScrollbarColors() {
    try {
        const trackColor = getComputedStyle(chatBoxContainer).getPropertyValue('background-color');
        const thumbColor = '#888';
        const scrollbarStyle = `${thumbColor} ${trackColor}`;
        chatBoxContainer.style.scrollbarColor = scrollbarStyle;
        commandSuggestions.style.scrollbarColor = scrollbarStyle;
    } catch (error) {
        console.warn("Could not update scrollbar colors:", error);
    }
}
const initialTheme = getPreferredTheme();
applyTheme(initialTheme);
themeToggler.addEventListener('click', () => setTheme(htmlElement.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light'));


// --- 命令提示功能 ---
function handleInputCommand() {
    const value = userInput.value;
    if (value.startsWith('/')) {
        const searchTerm = value.substring(1).toLowerCase();
        const filteredCommands = commands.filter(cmd => cmd.name.substring(1).toLowerCase().startsWith(searchTerm));
        if (filteredCommands.length > 0) { showSuggestions(filteredCommands); }
        else { hideSuggestions(); }
    } else { hideSuggestions(); }
}
function showSuggestions(filteredCommands) {
    commandSuggestions.innerHTML = ''; selectedSuggestionIndex = -1;
    filteredCommands.forEach((cmd) => {
        const item = document.createElement('a'); item.href = "#";
        item.classList.add('list-group-item', 'list-group-item-action');
        item.innerHTML = `<strong>${cmd.name}</strong><br><small>${cmd.description}</small>`;
        item.dataset.command = cmd.name;
        item.addEventListener('mousedown', (e) => { e.preventDefault(); selectSuggestion(cmd.name); });
        item.onclick = (e) => e.preventDefault();
        commandSuggestions.appendChild(item);
    });
    commandSuggestions.classList.remove('d-none'); updateScrollbarColors();
}
function hideSuggestions() {
    if (!commandSuggestions.classList.contains('d-none')) {
        commandSuggestions.classList.add('d-none');
        commandSuggestions.innerHTML = ''; selectedSuggestionIndex = -1;
    }
}
function selectSuggestion(commandName) {
    userInput.value = commandName;
    hideSuggestions();
    userInput.focus();
}
function highlightSuggestion(index) {
    const items = commandSuggestions.querySelectorAll('.list-group-item'); if (items.length === 0) return;
    items[selectedSuggestionIndex]?.classList.remove('active'); // Null check
    selectedSuggestionIndex = index;
    items[selectedSuggestionIndex]?.classList.add('active'); // Null check
    items[selectedSuggestionIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// --- 聊天控制 ---
function handleLocalCommand(command) {
    let handled = true;

    switch (command.trim()) {
        case '/clear':
            chatBoxContent.innerHTML = '';
            appendMessage("You", command, "user");
            appendMessage("System", "Chat history cleared.", "system");
            break;
        case '/help':
            const helpText = commands.map(cmd => `<strong>${cmd.name}</strong>: ${cmd.description}`).join('<br>');
            appendMessage("You", command, "user");
            appendMessage("System", `Available commands:<br>${helpText}`, "system");
            break;
        case '/theme':
            const currentTheme = htmlElement.getAttribute('data-bs-theme'); 
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
            appendMessage("You", command, "user");
            appendMessage("System", `Theme switched to ${currentTheme === 'light' ? 'dark' : 'light'}.`, "system");
            break;
        default:
            handled = false;
            break;
    }
    return handled;
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    hideSuggestions();

    if (handleLocalCommand(message)) {
        userInput.value = "";
        return;
    }

    if (N8N_WEBHOOK_URL === "YOUR_N8N_WEBHOOK_URL_HERE") {
        appendMessage("System", "⚠️ Error: n8n webhook URL not configured.", "system");
        return;
    }

    appendMessage("You", message, "user");
    userInput.value = "";

    userInput.disabled = true;
    typing.classList.remove("d-none");
    typing.classList.add("d-flex");

    try { // Fetch logic
        const res = await fetch(N8N_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: message, userId: userId}) });
        if (!res.ok) {
            let errorMsg = `HTTP error! Status: ${res.status} ${res.statusText}`;
            try { const errorData = await res.json(); errorMsg += ` - ${errorData.message || JSON.stringify(errorData)}`; }
            catch (e) { } throw new Error(errorMsg);
        }
        const data = await res.json();
        let replyText = data?.reply || data?.message || (typeof data === 'string' ? data : null);
        if (replyText !== null) {
            appendMessage("AI", replyText, "ai");
        } else {
            console.error("AI response format unexpected:", data);
            appendMessage("System", "⚠️ AI response format error.", "system");
        }
    } catch (err) { // Error handling
        console.error("Error sending/receiving message:", err);
        let displayError = "⚠️ Failed to communicate with the AI agent.";
        if (err.message?.includes("Failed to fetch")) {
            displayError += " Check network connection or webhook URL.";
        }
        else if (err.message) {
            displayError += ` Details: ${err.message.split('-')[0]}`;
        }
        appendMessage("System", displayError, "system");
    } finally {
        typing.classList.add("d-none");
        typing.classList.remove("d-flex");
        userInput.disabled = false;
        userInput.focus();
    }
}

function appendMessage(sender, text, type = "ai") {
    const messageWrapper = document.createElement("div");
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isUser = type === "user";
    const senderInitial = sender === "System" ? "S" : (sender === "AI" ? "A" : "User");
    const avatarBg = isUser ? 'bg-info' : (type === 'system' ? 'bg-warning' : 'bg-secondary');
    const avatar_1 = `<div class="avatar ${avatarBg} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"> ${senderInitial} </div>`;
    const avatar_2 = `<img src="img.jpg" alt="${sender} Avatar" class="avatar rounded-circle">`;
    const bubbleClasses = `p-3 rounded shadow-sm message-bubble ${type}`;
    const textAlignment = isUser ? 'text-end' : 'text-start';
    const timeAlignment = isUser ? 'text-end' : 'text-start';

    let formattedText;

    if (type === 'ai') {
        // 1. 使用 marked 將 AI 的 Markdown 文本轉換為 HTML
        const rawHtml = marked.parse(text, { gfm: true, breaks: true });    // gfm: true 啟用 GitHub Flavored Markdown (例如表格、刪除線);  breaks: true 將單個換行符視為 <br>        
        // 2. 使用 DOMPurify 清理生成的 HTML 以防止 XSS 攻擊
        formattedText = DOMPurify.sanitize(rawHtml);
    } else {
        // 對於使用者和系統訊息，進行 HTML 特殊字符轉義，並將換行符替換為 <br>
        formattedText = text.replace(/&/g, '&')
                        .replace(/</g, '<')
                        .replace(/>/g, '>')
                        .replace(/"/g, '"')
                        .replace(/'/g, "'");
        // 在轉譯完畢後，再處理換行符
        formattedText = formattedText.replace(/\n/g, "<br>");
    }

    const messageBox = `<div class="${bubbleClasses}"><div class="sender ${textAlignment}">${sender}</div><div class="${textAlignment}">${formattedText}</div><div class="timestamp ${timeAlignment}">${timestamp}</div></div>`;
    messageWrapper.className = `d-flex align-items-end mb-3 ${isUser ? "justify-content-end" : "justify-content-start"}`;
    const marginClass = isUser ? 'ms-2' : 'me-2';
    messageWrapper.innerHTML = isUser ? `<div class="flex-grow-1 d-flex justify-content-end">${messageBox}</div> <div class="${marginClass}">${avatar_1}</div>` : `<div class="${marginClass}">${avatar_2}</div> <div class="flex-grow-1">${messageBox}</div>`;
    chatBoxContent.appendChild(messageWrapper);
    scrollToBottom();
}

function scrollToBottom() { chatBoxContainer.scrollTo({ top: chatBoxContainer.scrollHeight, behavior: 'smooth' }); }

// --- Event Listeners (按鍵控制) ---
userInput.addEventListener('input', handleInputCommand);
userInput.addEventListener('keydown', (e) => {
    const suggestionsVisible = !commandSuggestions.classList.contains('d-none');
    if (suggestionsVisible) {
        const items = commandSuggestions.querySelectorAll('.list-group-item');
        if (items.length > 0) {
            let handled = false;
            switch (e.key) {
                case 'ArrowDown': highlightSuggestion((selectedSuggestionIndex + 1) % items.length);
                    handled = true;
                    break;
                case 'ArrowUp':
                    highlightSuggestion((selectedSuggestionIndex - 1 + items.length) % items.length);
                    handled = true;
                    break;
                case 'Enter':
                case 'Tab':
                    if (selectedSuggestionIndex >= 0) {
                        selectSuggestion(items[selectedSuggestionIndex].dataset.command);
                        handled = true;
                    }
                    else {
                        hideSuggestions();
                    }
                    break;
                case 'Escape':
                    hideSuggestions();
                    handled = true;
                    break;
            }
            if (handled) {e.preventDefault(); return; }
        }
    }
    if (e.ctrlKey && e.key === "Enter") { e.preventDefault(); sendMessage(); }
});
userInput.addEventListener('blur', () => { blurTimeout = setTimeout(hideSuggestions, 150); });
userInput.addEventListener('focus', () => { clearTimeout(blurTimeout); });

// Initial setup
userInput.focus();
appendMessage("AI", "支援 markdown 格式，可以試試看魔術指令: /help ", "ai");
updateScrollbarColors();
