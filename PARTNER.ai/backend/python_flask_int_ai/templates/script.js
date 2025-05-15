let voiceTone = 'female'; // default tone

const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const voiceToggleBtn = document.getElementById('voiceToggleBtn');
const chatBox = document.getElementById('chatBox');
const voiceAudio = document.getElementById('voice');

// Toggle male/female voice tone
voiceToggleBtn.addEventListener('click', () => {
  voiceTone = voiceTone === 'female' ? 'male' : 'female';
  voiceToggleBtn.textContent = voiceTone === 'female' ? '♀️' : '♂️';
});

// Send button click
sendBtn.addEventListener('click', () => {
  sendMessage();
});

// Enter key support
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Voice button click (speech-to-text)
voiceBtn.addEventListener('click', () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Your browser does not support speech recognition.');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    messageInput.value = transcript;
    sendMessage(transcript);
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
  };
});

// Send message to backend
async function sendMessage(inputText = null) {
  const msg = inputText || messageInput.value.trim();
  if (!msg) return;

  appendMessage(msg, 'user');
  messageInput.value = '';

  try {
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, tone: voiceTone })
    });

    const data = await res.json();
    appendMessage(data.reply, 'bot');

    if (data.audio_url) {
      voiceAudio.src = data.audio_url;
      voiceAudio.play();
    }
  } catch (err) {
    console.error('Error sending message:', err);
    appendMessage('⚠️ Error: Unable to get response.', 'bot');
  }
}

// Add message to chat window
function appendMessage(msg, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = msg;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
