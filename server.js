const express = require("express");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const { message, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image required" });
    }

    const messages = [];

    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "What is in this image?" },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } }
        ]
      });
    } else {
      messages.push({
        role: "user",
        content: message
      });
    }

    const model = image ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile";

    const completion = await groq.chat.completions.create({
      model: model,
      messages: messages,
      max_tokens: 1024,
    });

    const reply = completion.choices[0]?.message?.content || "No response.";
    res.json({ response: reply });

  } catch (err) {
    console.error("Groq Error:", err.message || err);
    res.status(500).json({ error: "AI API failed: " + (err.message || "Unknown error") });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});