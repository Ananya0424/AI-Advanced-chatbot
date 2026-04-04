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

    // Fallback models — tries each one until one works
    const textModels = [
      "meta-llama/llama-3.3-70b-instruct:free",
      "google/gemma-3-27b-it:free",
      "google/gemma-3-12b-it:free",
      "qwen/qwen3-8b:free",
      "deepseek/deepseek-v3:free",
      "microsoft/phi-4-reasoning-plus:free",
    ];
    const imageModels = [
      "meta-llama/llama-3.2-11b-vision-instruct:free",
      "google/gemma-3-12b-it:free",
    ];

    const models = image ? imageModels : textModels;
    let reply = null;
    let lastError = null;

    for (const model of models) {
      try {
        const completion = await client.chat.completions.create({
          model,
          messages,
        });
        reply = completion.choices[0]?.message?.content || "No response received.";
        console.log(`Success with model: ${model}`);
        break;
      } catch (modelErr) {
        console.warn(`Model ${model} failed (${modelErr.status}):`, modelErr.message);
        lastError = modelErr;
        // Retry on rate limit (429), server error (503), or not found (404)
        const retryStatuses = [429, 503, 404];
        if (!retryStatuses.includes(modelErr.status)) break;
      }
    }

    if (reply) {
      res.json({ response: reply });
    } else {
      throw lastError;
    }

  } catch (err) {
    console.error("Error:", err.message || err);
    const status = err.status || 500;
    res.status(status).json({
      error: "AI API error: " + (err.message || "Unknown error"),
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});