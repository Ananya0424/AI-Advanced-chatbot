const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");
const messagesDiv = document.getElementById("messages");

// Additional UI references
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const attachmentThumbnail = document.getElementById("attachmentThumbnail");
const attachmentName = document.getElementById("attachmentName");
const removeAttachmentBtn = document.getElementById("removeAttachmentBtn");
const mobileToggleBtn = document.getElementById("mobileToggleBtn");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

let selectedImage = null;
let selectedImagePreview = null;

// HTML escaping helper
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Markdown parser with code block formatting & copy buttons
function parseMarkdown(text) {
  if (!text) return "";
  
  const codeBlocks = [];
  let placeholderText = text.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const id = "code_block_" + Math.random().toString(36).substring(2, 9);
    const cleanLang = lang.trim() || "code";
    const escapedCode = escapeHtml(code.trim());
    
    codeBlocks.push({
      id,
      html: `<div class="code-block">
        <div class="code-header">
          <span class="code-lang">${cleanLang}</span>
          <button class="copy-btn" data-code-id="${id}" onclick="copyCode(this)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre><code id="${id}">${escapedCode}</code></pre>
      </div>`
    });
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  placeholderText = escapeHtml(placeholderText);

  // Inline formatting
  placeholderText = placeholderText.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  placeholderText = placeholderText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  placeholderText = placeholderText.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Headings
  placeholderText = placeholderText.replace(/^### (.*$)/gim, '<h4 class="msg-heading">$1</h4>');
  placeholderText = placeholderText.replace(/^## (.*$)/gim, '<h3 class="msg-heading">$1</h3>');
  placeholderText = placeholderText.replace(/^# (.*$)/gim, '<h2 class="msg-heading">$1</h2>');

  // Bullet list items
  placeholderText = placeholderText.replace(/^\s*[-*+]\s+(.*$)/gim, '<li class="msg-list-item">$1</li>');

  // Newlines to breaks
  placeholderText = placeholderText.replace(/\n/g, "<br>");

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    placeholderText = placeholderText.replace(`___CODE_BLOCK_${index}___`, block.html);
  });

  return placeholderText;
}

// Copy code function
function copyCode(btn) {
  const codeId = btn.getAttribute("data-code-id");
  const codeEl = document.getElementById(codeId);
  if (!codeEl) return;

  const textToCopy = codeEl.innerText || codeEl.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    const span = btn.querySelector("span");
    const originalText = span ? span.innerText : "Copy";
    if (span) span.innerText = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      if (span) span.innerText = originalText;
      btn.classList.remove("copied");
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy:", err);
  });
}

function sendChip(text) {
  userInput.value = text;
  autoResizeTextarea();
  handleSend();
}

function clearChat() {
  messagesDiv.innerHTML = `
    <div class="welcome" id="welcome">
      <div class="welcome-content">
        <h2 class="welcome-title">Nexus Workspace</h2>
        <p class="welcome-subtitle">Ask a question, write code, or attach an image for analysis.</p>

        <div class="suggestion-pills">
          <button class="chip" onclick="sendChip('What is artificial intelligence?')">
            <span>What is AI?</span>
          </button>
          <button class="chip" onclick="sendChip('Explain machine learning simply')">
            <span>Machine Learning</span>
          </button>
          <button class="chip" onclick="sendChip('Write a clean JavaScript async function example')">
            <span>Async JS Example</span>
          </button>
          <button class="chip" onclick="sendChip('Give me a fun fact about software engineering')">
            <span>Tech Trivia</span>
          </button>
        </div>
      </div>
    </div>`;
}

// Attach image handler
imageBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = reader.result.split(",")[1];
    selectedImagePreview = reader.result;
    
    // UI update for attachment preview
    if (imagePreviewContainer && attachmentThumbnail) {
      attachmentThumbnail.src = reader.result;
      if (attachmentName) attachmentName.textContent = file.name || "Attached Image";
      imagePreviewContainer.style.display = "flex";
    }
    imageBtn.classList.add("active");
  };
  reader.readAsDataURL(file);
});

// Clear attached image
function clearSelectedImage() {
  selectedImage = null;
  selectedImagePreview = null;
  imageInput.value = "";
  if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
  imageBtn.classList.remove("active");
}

if (removeAttachmentBtn) {
  removeAttachmentBtn.addEventListener("click", clearSelectedImage);
}

// Add message to chat log
function addMessage(type, text, imgSrc = null) {
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  const row = document.createElement("div");
  row.className = `msg-row ${type === "user" ? "user-row" : "ai-row"}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  if (type === "user") {
    avatar.textContent = "You";
  } else {
    avatar.textContent = "Nexus";
  }

  const bubbleContainer = document.createElement("div");
  bubbleContainer.className = "msg-bubble-container";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";

  if (imgSrc) {
    const imgWrapper = document.createElement("div");
    imgWrapper.className = "img-preview-wrapper";
    const img = document.createElement("img");
    img.src = imgSrc;
    img.className = "img-preview";
    img.alt = "Uploaded image";
    imgWrapper.appendChild(img);
    bubble.appendChild(imgWrapper);
  }

  if (text) {
    const contentDiv = document.createElement("div");
    contentDiv.className = "msg-text-content";
    if (type === "user") {
      contentDiv.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
    } else {
      contentDiv.innerHTML = parseMarkdown(text);
    }
    bubble.appendChild(contentDiv);
  }

  bubbleContainer.appendChild(bubble);
  row.appendChild(avatar);
  row.appendChild(bubbleContainer);

  messagesDiv.appendChild(row);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Typing indicator state
function showTyping() {
  const welcome = document.getElementById("welcome");
  if (welcome) welcome.remove();

  const row = document.createElement("div");
  row.className = "msg-row ai-row";
  row.id = "typingRow";
  row.innerHTML = `
    <div class="msg-avatar">Nexus</div>
    <div class="msg-bubble-container">
      <div class="msg-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  messagesDiv.appendChild(row);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typingRow");
  if (t) t.remove();
}

// Send message handler
async function handleSend() {
  const text = userInput.value.trim();
  if (!text && !selectedImage) return;

  addMessage("user", text, selectedImagePreview);
  userInput.value = "";
  autoResizeTextarea();

  const imageToSend = selectedImage;
  clearSelectedImage();

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

// Auto-resizing textarea
function autoResizeTextarea() {
  if (userInput.tagName.toLowerCase() === "textarea") {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + "px";
  }
}

if (userInput.tagName.toLowerCase() === "textarea") {
  userInput.addEventListener("input", autoResizeTextarea);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
} else {
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
  });
}

sendBtn.addEventListener("click", handleSend);

// Mobile sidebar toggle
if (mobileToggleBtn && sidebar && sidebarOverlay) {
  mobileToggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show-mobile");
    sidebarOverlay.classList.toggle("show-mobile");
  });
  
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("show-mobile");
    sidebarOverlay.classList.remove("show-mobile");
  });
}