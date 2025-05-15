let voiceTone = 'female'; // default
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('message');
const voiceToggleBtn = document.getElementById('voiceToggleBtn');
const sendBtn = document.getElementById('sendBtn');
const voiceAudio = document.getElementById('voice');

// Voice tone toggle
voiceToggleBtn.addEventListener('click', () => {
  voiceTone = voiceTone === 'female' ? 'male' : 'female';
  voiceToggleBtn.textContent = voiceTone === 'female' ? '♀️' : '♂️';
});

// Send button
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    appendMessage(message, 'user');
    messageInput.value = '';
    getChatGPTResponse(message);
  }
});

// ChatGPT + TTS Handler
async function getChatGPTResponse(userMessage) {
  appendMessage("Typing...", 'bot');

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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.",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are Partner.ai, a friendly, emotionally intelligent chatbot that responds warmly." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Replace "Typing..." with actual reply
    document.querySelectorAll('.bot').forEach(el => {
      if (el.textContent === 'Typing...') el.remove();
    });
    appendMessage(reply, 'bot');
    speak(reply);

  } catch (error) {
    console.error("OpenAI API error:", error);
    appendMessage("⚠️ Sorry, I couldn't respond.", 'bot');
  }
}

// Append message to chat
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Speak response with Web Speech API
function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.pitch = 1;
  utter.rate = 1;
  utter.voice = Array.from(synth.getVoices()).find(v =>
    voiceTone === 'female' ? v.name.toLowerCase().includes('female') || v.name.includes('Samantha') : v.name.toLowerCase().includes('male') || v.name.includes('Daniel')
  ) || synth.getVoices()[0];

  synth.speak(utter);
}
