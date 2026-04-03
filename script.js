const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
const messagesDiv = document.getElementById("messages");

let selectedImage = null;
let selectedImagePreview = null;

function sendChip(text) {
  userInput.value = text;
  handleSend();
}

function clearChat() {
  messagesDiv.innerHTML = `
    <div class="welcome" id="welcome">
      <img src="ai.png" alt="AI" class="welcome-img" />
      <h2>Hello! How can I help you? 👋</h2>
      <p>Ask me anything. I'm powered by AI.</p>
      <div class="chips">
        <button class="chip" onclick="sendChip('What is artificial intelligence?')">What is AI?</button>
        <button class="chip" onclick="sendChip('Write a poem about nature')">Write a poem</button>
        <button class="chip" onclick="sendChip('Explain machine learning simply')">Machine learning</button>
        <button class="chip" onclick="sendChip('Give me a fun fact')">Fun fact</button>
      </div>
    </div>`;
}

imageBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = reader.result.split(",")[1];
    selectedImagePreview = reader.result;
    imageBtn.style.color = "#4f8ef7";
    imageBtn.style.borderColor = "#4f8ef7";
  };
  reader.readAsDataURL(file);
});

function addMessage(type, text, imgSrc = null) {
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  const row = document.createElement("div");
  row.className = `msg-row ${type === "user" ? "user-row" : "ai-row"}`;

  const avatar = document.createElement("img");
  avatar.className = "msg-avatar";
  avatar.src = type === "user" ? "user.png" : "ai.png";
  avatar.alt = type;

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";

  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "img-preview";
    bubble.appendChild(img);
  }

  if (text) {
    const p = document.createElement("p");
    p.innerHTML = text.replace(/\n/g, "<br>");
    bubble.appendChild(p);
  }

  row.appendChild(avatar);
  row.appendChild(bubble);
  messagesDiv.appendChild(row);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showTyping() {
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  const row = document.createElement("div");
  row.className = "msg-row ai-row";
  row.id = "typingRow";
  row.innerHTML = `
    <img class="msg-avatar" src="ai.png" alt="ai" />
    <div class="msg-bubble typing-dots">
      <span></span><span></span><span></span>
    </div>`;
  messagesDiv.appendChild(row);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typingRow");
  if (t) t.remove();
}

async function handleSend() {
  const text = userInput.value.trim();
  if (!text && !selectedImage) return;

  addMessage("user", text, selectedImagePreview);
  userInput.value = "";

  const imageToSend = selectedImage;
  selectedImage = null;
  selectedImagePreview = null;
  imageInput.value = "";
  imageBtn.style.color = "";
  imageBtn.style.borderColor = "";

  sendBtn.disabled = true;
  showTyping();

  try {
    const payload = {};
    if (text) payload.message = text;
    if (imageToSend) payload.image = imageToSend;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    hideTyping();

    const reply = data.response || data.reply;
    if (reply) {
      addMessage("ai", reply);
    } else {
      addMessage("ai", "⚠️ " + (data.error || "Something went wrong. Please try again."));
    }
  } catch (err) {
    hideTyping();
    addMessage("ai", "⚠️ Could not connect to server. Please check your connection and try again.");
  }

  sendBtn.disabled = false;
  userInput.focus();
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});