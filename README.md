# 🤖 AI Advanced Chatbot

A modern web-based AI chatbot built with **HTML, CSS, JavaScript, Node.js (Express)**, and powered by **Groq API (LLaMA 3.3 70B)** — supports both text and image-based conversations.

---

## 🚀 Features

- 💬 Real-time text-based AI chat
- 🖼️ Image upload and analysis (multimodal)
- ⚡ Ultra-fast responses via Groq API (LLaMA 3.3 70B)
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
| **Backend** | Node.js, Express.js |
| **AI Model** | LLaMA 3.3 70B (via Groq API) |
| **Vision Model** | LLaMA 4 Scout 17B (image analysis) |
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
├── server.js         # Express backend + Groq API
├── package.json      # Project metadata & dependencies
├── .env              # Environment variables (API key) — DO NOT COMMIT
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- Groq API Key (free) → [https://console.groq.com](https://console.groq.com)

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
GROQ_API_KEY=your_groq_api_key_here
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
  Groq API (LLaMA 3.3 70B for text)
  Groq API (LLaMA 4 Scout for images)
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
   - `GROQ_API_KEY` = your key
6. Click **Deploy!**

---

## 📦 Dependencies

```json
{
  "express": "^5.2.1",
  "groq-sdk": "latest",
  "dotenv": "^17.2.3",
  "axios": "^1.13.2",
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