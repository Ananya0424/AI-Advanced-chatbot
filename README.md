# 🤖 AI Advanced Chatbot

A modern web-based AI chatbot built with **HTML, CSS, JavaScript, Node.js (Express)**, and powered by **OpenRouter API** with multiple free AI models — supports both text and image-based conversations.

🔗 **Live Demo:** [https://ai-advanced-chatbot-1.onrender.com](https://ai-advanced-chatbot-1.onrender.com)

---

## 🚀 Features

- 💬 Real-time text-based AI chat
- 🖼️ Image upload and analysis (multimodal)
- ⚡ Multiple AI model fallback — auto-switches if one fails (429/404/503)
- 🎨 Clean, responsive light-theme UI
- 🔐 Secure API key handling via `.env`
- 💡 Suggestion chips for quick queries
- 🔄 Typing animation indicator
- 🗑️ Clear chat functionality
- 📱 Mobile responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Node.js, Express.js v4 |
| **AI Models (Text)** | LLaMA 3.3 70B, Gemma 3 27B, Qwen3 8B (via OpenRouter) |
| **AI Models (Image)** | LLaMA 3.2 11B Vision, Gemma 3 12B (via OpenRouter) |
| **HTTP Client** | Axios |
| **Config** | dotenv |

---

## 📁 Project Structure

```
AI-Advanced-chatbot/
│
├── index.html        # Chat UI
├── style.css         # Styling (light theme)
├── script.js         # Frontend logic
├── server.js         # Express backend + OpenRouter API
├── package.json      # Project metadata & dependencies
├── render.yaml       # Render deployment config
├── .env              # Environment variables (API key) — DO NOT COMMIT
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- OpenRouter API Key (free) → [https://openrouter.ai](https://openrouter.ai)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/Ananya0424/AI-Advanced-chatbot.git
cd AI-Advanced-chatbot
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Create `.env` File

Create a `.env` file in the root folder:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> **Never commit your `.env` file to GitHub!**

---

### Step 4 — Run the Server

```bash
node server.js
```

---

### Step 5 — Open in Browser

```
http://localhost:3000
```

---

## 🔁 How It Works

```
User sends message/image
         │
         ▼
  Express /api/chat endpoint
         │
         ▼
  Try Model 1 (LLaMA 3.3 70B)
  → if 429/404/503: Try Model 2 (Gemma 3 27B)
  → if fail again:  Try Model 3 (Qwen3 8B) ...
         │
         ▼
  Response sent back to UI
```

---

## 🌐 Deployment (Render)

1. Push code to GitHub (make sure `.env` is in `.gitignore`)
2. Go to [https://render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add Environment Variable:
   - `OPENROUTER_API_KEY` = your key
6. Click **Deploy!**

> ⚠️ On the free Render plan, the server sleeps after 15 min of inactivity. First request may take 30-50 seconds.

---

## 📦 Dependencies

```json
{
  "express": "^4.19.2",
  "openai": "^4.52.0",
  "dotenv": "^16.4.5",
  "axios": "^1.7.2",
  "cors": "^2.8.5"
}
```

---

## 🙋‍♀️ Author

**Ananya Sharma**
- GitHub: [@Ananya0424](https://github.com/Ananya0424)
- Email: ananyasharma242004@gmail.com

---

## 📄 License

This project is licensed under the ISC License.