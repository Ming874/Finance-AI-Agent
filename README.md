# Financial Analysis AI Agent - Web Interface
此為 demo 版，後端功能尚未完全實踐 (LLM 尚無法訪問外部環境)，目前仍在持續更新中

這是一個用於與「金融分析 AI 代理」互動的前端網頁介面。使用者可以透過這個介面向後端 AI 服務（由 N8N webhook 驅動，並使用 Gemini 2.0 Pro 模型）發送訊息，並接收 AI 的分析、回答或執行特定指令。

## ✨ 功能特性

*   **互動式聊天介面**: 提供一個類似聊天室的介面，顯示使用者和 AI 的對話紀錄。
*   **Markdown 支援**: AI 的回覆支援 Markdown 格式，可以正確呈現標題、列表、程式碼區塊、表格等。
*   **安全渲染**: 使用 `marked.js` 解析 Markdown，並透過 `DOMPurify` 清理 HTML，防止 XSS 攻擊。
*   **命令系統**: 支援斜線 (`/`) 命令，並提供即時的命令建議與自動完成。
    *   `/help`: 顯示可用命令列表。
    *   `/clear`: 清除當前聊天視窗的歷史紀錄。
    *   `/theme`: 切換淺色/深色主題。
    *   `/memory`: (開發中) 讓 AI 記住特定訊息。
    *   `/settings`: (開發中) 調整 AI 設定。
*   **主題切換**: 提供淺色 (Light) 和深色 (Dark) 模式，並將使用者偏好儲存在 `localStorage` 中。
*   **打字指示器**: 當 AI 正在處理請求並生成回覆時，顯示 "AI is typing..." 動畫。
*   **使用者識別**: 為每個使用者生成唯一的 UUID 並儲存在 `localStorage`，用於後端區分對話。
*   **響應式設計**: 使用 Bootstrap 5 建構，能在不同螢幕尺寸上提供良好的視覺效果。
*   **自訂樣式**: 包含一些自訂 CSS 樣式，用於美化介面、捲軸和輸入框效果。

## 🛠️ 設定與安裝

1.  **確保檔案結構**:
    *   將 `index.html` 檔案放在你的專案根目錄。
    *   確保 `head.png` (用於 favicon) 和 `img.jpg` (用於 AI 頭像) 檔案也放在同一個根目錄下。如果沒有這些圖片檔，介面仍能運作，但會缺少圖示和頭像。

2.  **配置 N8N Webhook URL**:
    *   用文字編輯器打開 `index.html` 檔案。
    *   找到以下這行 JavaScript 程式碼：
        ```javascript
        const N8N_WEBHOOK_URL = "https://mingcc.app.n8n.cloud/webhook/ac662654-0156-44d6-ad50-c68e7a7a2355"; // 或 "YOUR_N8N_WEBHOOK_URL_HERE"
        ```
    *   將引號中的 URL 替換成你**實際的 N8N Webhook URL**。**這是讓聊天功能正常運作的關鍵步驟。**

3.  **運行**:
    *   **方法一 (簡單測試)**: 直接在你的網頁瀏覽器中打開 `index.html` 檔案 (例如：雙擊檔案)。
    *   **方法二 (推薦)**: 由於可能涉及跨域請求 (CORS) 或未來需要更複雜的互動，建議使用本地伺服器來運行。
        *   如果你安裝了 Node.js，可以在專案根目錄打開終端機，執行 `npx serve` 或 `npx http-server`，然後訪問瀏覽器中顯示的本地地址 (通常是 `http://localhost:8080` 或 `http://localhost:3000`)。
        *   如果你安裝了 Python 3，可以在終端機執行 `python -m http.server`，然後訪問 `http://localhost:8000`。

## 🚀 使用方式

1.  打開 `index.html` 頁面。
2.  在底部的輸入框中輸入你的問題或訊息。
3.  按下 `Enter` 鍵、點擊 "Send" 按鈕或按下 `Ctrl` + `Enter` 發送訊息。
4.  若要使用命令，輸入 `/`，會出現建議列表。你可以：
    *   用滑鼠點擊建議。
    *   使用 `↑` 和 `↓` 方向鍵選擇建議。
    *   按下 `Enter` 或 `Tab` 鍵自動完成選中的命令。
    *   按下 `Escape` 鍵關閉建議列表。
5.  點擊右上角的太陽/月亮圖示來切換淺色/深色主題。

## ⚙️ 技術棧

*   **前端**:
    *   HTML5
    *   CSS3 (包含自訂樣式和漸層背景)
    *   JavaScript (ES6+)
    *   [Bootstrap 5](https://getbootstrap.com/): UI 框架
    *   [Bootstrap Icons](https://icons.getbootstrap.com/): 圖示庫
    *   [marked.js](https://marked.js.org/): Markdown 解析器
    *   [DOMPurify](https://github.com/cure53/DOMPurify): HTML 清理庫 (安全性)
*   **後端**:
    *   [N8N](https://n8n.io/): 工作流程自動化工具，用於接收 webhook 並與 AI 模型互動。
    *   [Google Gemini 2.0 Pro](https://ai.google.dev/): 作為後端的 AI 模型。
