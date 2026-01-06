const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent";

app.post("/api/chat", async (req, res) => {
  try {
    const { message, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "Message or image required" });
    }

    const parts = [];

    if (message) {
      parts.push({ text: message });
    }

    if (image) {
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: image
        }
      });
    }

    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts }]
      },
      {
        headers: { "Content-Type": "application/json" }
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });

  } catch (err) {
    console.error("🔥 Gemini Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Gemini API failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
