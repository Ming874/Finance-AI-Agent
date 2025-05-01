# Financial Analysis AI Agent - Web Interface

**Disclaimer:** This is a **demo version** of the web interface for the Financial Analysis AI Agent. Please note that backend functionality is currently limited (e.g., the LLM cannot yet access external real-time data sources or execute complex financial actions). The project is under **active development** and features are subject to change.

This project provides a frontend web interface for interacting with the Financial Analysis AI Agent. Users can send messages and commands via this interface to a backend service, which is powered by an **N8N webhook** and utilizes the **Google Gemini 2.0 Pro** model for analysis and responses.

## ✨ Features

*   **Interactive Chat Interface**: Provides a familiar chat-like UI to display the conversation history between the user and the AI.
*   **Markdown Support**: AI responses are rendered supporting standard Markdown syntax (headings, lists, code blocks, tables, etc.).
*   **Secure Rendering**: Utilizes `marked.js` for Markdown parsing and `DOMPurify` for HTML sanitization to prevent Cross-Site Scripting (XSS) vulnerabilities.
*   **Command System**: Supports slash (`/`) commands with real-time suggestions and autocompletion.
    *   `/help`: Displays the list of available commands.
    *   `/clear`: Clears the current chat history in the interface.
    *   `/theme`: Toggles between light and dark color themes.
    *   `/memory`: (Work in Progress) Instructs the AI to remember specific information (functionality not yet implemented).
    *   `/settings`: (Work in Progress) Allows adjusting AI settings (functionality not yet implemented).
*   **Theme Switching**: Offers both Light and Dark modes. User preference is persisted using `localStorage`.
*   **Typing Indicator**: Displays an animation ("AI is typing...") while the backend is processing a request and generating a response.
*   **User Identification**: Generates and stores a unique UUID for each user in `localStorage` to facilitate session management and context tracking on the backend.
*   **Responsive Design**: Built with Bootstrap 5 to ensure a consistent user experience across various screen sizes and devices.
*   **Custom Styling**: Includes custom CSS for enhanced aesthetics, scrollbar styling, and input field effects (like the RGB glow).

## 🛠️ Setup and Installation

1.  **File Structure**:
    *   Place the `index.html` file in your project's root directory.
    *   Ensure `head.png` (for the favicon) and `img.jpg` (for the AI avatar) are also in the root directory. The interface will function without these images, but the favicon and avatar will be missing.

2.  **Configure N8N Webhook URL**:
    *   Open `index.html` in a text editor.
    *   Locate the following JavaScript constant definition:
        ```javascript
        const N8N_WEBHOOK_URL = "https://mingcc.app.n8n.cloud/webhook/ac662654-0156-44d6-ad50-c68e7a7a2355"; // Or "YOUR_N8N_WEBHOOK_URL_HERE"
        ```
    *   Replace the URL string with your **actual N8N Webhook URL**. This step is **crucial** for the chat functionality to connect to the backend.

3.  **Running the Interface**:
    *   **Method 1 (Simple Local Testing):** Open the `index.html` file directly in your web browser (e.g., by double-clicking it).
        *   *Note:* Direct file access (`file://` protocol) might encounter Cross-Origin Resource Sharing (CORS) issues when making requests to the N8N webhook, depending on browser security settings.
    *   **Method 2 (Recommended - Using a Local Server):** Running the interface via a local web server avoids potential CORS issues and provides a more realistic testing environment.
        *   If you have Node.js installed: Open a terminal in the project root directory and run `npx serve` or `npx http-server`. Access the interface via the provided local URL (e.g., `http://localhost:8080` or `http://localhost:3000`).
        *   If you have Python 3 installed: Open a terminal in the project root directory and run `python -m http.server`. Access the interface via `http://localhost:8000`.

## 🚀 Usage

1.  Open the `index.html` page in your browser (preferably served via a local server).
2.  Type your question or message related to financial analysis in the input field at the bottom.
3.  Press `Enter`, click the "Send" button, or use the `Ctrl` + `Enter` keyboard shortcut to send your message.
4.  To use a command, type `/`. A suggestion list will appear. You can:
    *   Click on a suggestion with your mouse.
    *   Use the `↑` (Up Arrow) and `↓` (Down Arrow) keys to navigate the suggestions.
    *   Press `Enter` or `Tab` to autocomplete the selected command.
    *   Press `Escape` to close the suggestion list.
5.  Click the sun/moon icon in the top-right corner to toggle between the light and dark themes.

## ⚙️ Tech Stack

*   **Frontend**:
    *   HTML5
    *   CSS3 (including Custom Properties for theming, gradient backgrounds)
    *   JavaScript (ES6+)
    *   [Bootstrap 5](https://getbootstrap.com/): CSS Framework for UI components and layout.
    *   [Bootstrap Icons](https://icons.getbootstrap.com/): SVG Icon library.
    *   [marked.js](https://marked.js.org/): Markdown parser library.
    *   [DOMPurify](https://github.com/cure53/DOMPurify): HTML sanitizer for security.
*   **Backend**:
    *   [N8N](https://n8n.io/): Workflow automation tool acting as the webhook receiver and orchestrator.
    *   [Google Gemini 2.0 Pro](https://ai.google.dev/): The Large Language Model used for processing requests and generating responses.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Please feel free to check the [issues page](link-to-your-issues-page-if-you-have-one) or submit a pull request.