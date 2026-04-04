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
    "HTTP-Referer": "https://ai-advanced-chatbot-1.onrender.com",
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
      return res.status(500).json({ error: "API key not configured." });
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

    // openrouter/free = auto-selects best available free model — no more 404!
    // Fallback list of confirmed working free models (April 2026)
    const textModels = [
      "openrouter/auto",                          // auto-select best model
      "meta-llama/llama-3.3-70b-instruct:free",
      "deepseek/deepseek-chat-v3-0324:free",
      "google/gemma-3-27b-it:free",
      "google/gemma-3-12b-it:free",
      "meta-llama/llama-4-maverick:free",
      "qwen/qwen3-235b-a22b:free",
    ];

    const imageModels = [
      "meta-llama/llama-3.2-11b-vision-instruct:free",
      "google/gemma-3-12b-it:free",
      "openrouter/auto",
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
        console.log(`✅ Success with model: ${model}`);
        break;
      } catch (modelErr) {
        console.warn(`❌ Model ${model} failed (${modelErr.status}): ${modelErr.message}`);
        lastError = modelErr;
        const retryStatuses = [429, 503, 404, 400];
        if (!retryStatuses.includes(modelErr.status)) break;
      }
    }

    if (reply) {
      res.json({ response: reply });
    } else {
      throw lastError;
    }

  } catch (err) {
    console.error("Final error:", err.message || err);
    res.status(err.status || 500).json({
      error: "AI API error: " + (err.message || "Unknown error"),
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});