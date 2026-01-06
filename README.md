# AI Advanced Chatbot 🤖

This project is a web-based AI chatbot built using **HTML, CSS, JavaScript, and Node.js (Express)**.  
The chatbot allows users to interact with an AI assistant using **text input**, and it is designed to be extended for **image + text (multimodal) interaction** using the Gemini API.

---

## 🚀 Features

- 💬 Text-based AI chat interface
- 🎨 Clean and responsive UI
- 🧠 Backend proxy server to securely handle API requests
- 🔐 API key protected using `.env` file
- 🖼️ Image upload support (UI ready for multimodal extension)
- 📜 Scrollable chat history

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- JavaScript 

### Backend
- Node.js
- Express.js
- Axios
- Dotenv

---

## 📂 Project Structure

│── server.js # Express backend server
│── index.html # Chatbot UI
│── style.css # Styling
│── script.js # Frontend logic
│── package.json # Project metadata & dependencies
│── package-lock.json # Dependency lock file
│── .env # Environment variables (API key)

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone <your-repository-url>
cd AI-Advanced-chatbot
'''
###2️⃣ Install Dependencies
'''bash 
   npm install
'''
###3️⃣ Create .env File
Create a .env file in the project root and add:
GEMINI_API_KEY=your_api_key_here

4️⃣ Run the Server
'''bash
  node server.js
'''

Server will start at:
http://localhost:3000


# Gemini API Setup Instructions

## How to Get Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## How to Configure the Chatbot

1. Open `script.js` file
2. Find line 14: `const API_KEY = 'YOUR_API_KEY';`
3. Replace `'YOUR_API_KEY'` with your actual API key from Google AI Studio
4. Save the file

Example:
```javascript
const API_KEY = 'AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

## Important Notes

- Keep your API key secure and never share it publicly
- The API key should be kept in a secure environment for production use
- For production, consider using environment variables or a backend server to hide the API key

## Testing

After setting up your API key:
1. Open `index.html` in your web browser
2. Type a message in the input field
3. Press Enter or click the submit button
4. The chatbot should now respond using Gemini AI

## Troubleshooting

If you're still having issues:
- Check that your API key is correct
- Ensure you have an active internet connection
- Check the browser console for any error messages
- Verify that the Gemini API is enabled in your Google Cloud project
