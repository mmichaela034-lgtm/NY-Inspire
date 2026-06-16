let userRole = 'student';

function setRole(role, btn) {
  userRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
let conversationHistory = [];

async function sendMessage() {
  const input = document.getElementById("userInput");
  const messages = document.getElementById("chatMessages");
  const text = input.value.trim();
  if (!text) return;

  const userDiv = document.createElement("div");
  userDiv.className = "message user-message";
  userDiv.textContent = text;
  messages.appendChild(userDiv);
  input.value = "";

  const loadDiv = document.createElement("div");
  loadDiv.className = "message bot-message loading";
  loadDiv.textContent = "Thinking...";
  messages.appendChild(loadDiv);
  messages.scrollTop = messages.scrollHeight;

  conversationHistory.push({ role: "user", content: text });

  try {
    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          message: `[I am a ${userRole}] ${text}`,  // Include the user's role in the message
        history: conversationHistory.slice(-10)
      })
    });
    const data = await res.json();
    const reply = data.reply || "Sorry, I could not get an answer.";
    loadDiv.textContent = reply;
    loadDiv.className = "message bot-message";
    conversationHistory.push({ role: "assistant", content: reply });
  } catch (e) {
    loadDiv.textContent = "Connection error. Please try again.";
    loadDiv.className = "message bot-message";
  }
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("userInput")
  .addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });