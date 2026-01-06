let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let submitBtn = document.querySelector("#submit")
let imageBtn = document.querySelector("#image")
let imageInput = document.querySelector("#image input")

let selectedImage = null

function createChat(html, cls) {
    let div = document.createElement("div")
    div.className = cls
    div.innerHTML = html
    return div
}

// IMAGE SELECT
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
        selectedImage = reader.result.split(",")[1]

        chatContainer.appendChild(
            createChat(
                `<img src="user.png" id="userImage">
                 <div class="user-chat-area">
                    <img src="${reader.result}" class="chooseimg">
                 </div>`,
                "user-chat-box"
            )
        )
    }
    reader.readAsDataURL(file)
})

imageBtn.addEventListener("click", () => imageInput.click())

async function sendMessage(text) {
    const payload = { message: text }
    if (selectedImage) payload.image = selectedImage

    const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })

    const data = await res.json()
    selectedImage = null
    imageInput.value = ""
    return data.response
}

async function handleSend() {
    const text = prompt.value.trim()
    if (!text && !selectedImage) return

    chatContainer.appendChild(
        createChat(
            `<img src="user.png" id="userImage">
             <div class="user-chat-area">${text}</div>`,
            "user-chat-box"
        )
    )

    prompt.value = ""

    const reply = await sendMessage(text)

    chatContainer.appendChild(
        createChat(
            `<img src="ai.png" id="aiImage">
             <div class="ai-chat-area">${reply}</div>`,
            "ai-chat-box"
        )
    )
}

submitBtn.addEventListener("click", handleSend)
prompt.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSend()
})
