const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://ai-advanced-chatbot.onrender.com",
    "X-Title": "AI Advanced Chatbot",
  },
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image required" });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: "API key not configured. Please set OPENROUTER_API_KEY." });
    }

    const messages = [];

    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "What is in this image?" },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${image}` },
          },
        ],
      });
    } else {
      messages.push({ role: "user", content: message });
    }

    const completion = await client.chat.completions.create({
      model: image ? "meta-llama/llama-4-scout:free" : "deepseek/deepseek-r1:free",
      messages: messages,
    });

    const reply = completion.choices[0]?.message?.content || "No response received.";
    res.json({ response: reply });

  } catch (err) {
    console.error("Error:", err.message || err);
    const status = err.status || 500;
    res.status(status).json({
      error: "AI API error: " + (err.message || "Unknown error"),
    });
  }
});

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});