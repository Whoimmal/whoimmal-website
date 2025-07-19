import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getDatabase, ref, push, set, onChildAdded,
  serverTimestamp, onDisconnect, onValue
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB98E5TYR9ar3hCxBgXMcYZmaBDC4x3M1s",
  authDomain: "whoimmal-discussion-chat.firebaseapp.com",
  databaseURL: "https://whoimmal-discussion-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "whoimmal-discussion-chat",
  storageBucket: "whoimmal-discussion-chat.firebasestorage.app",
  messagingSenderId: "629785852894",
  appId: "1:629785852894:web:d62944fde16f11d7993b4f"
};

// ✅ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "chat/messages");
const typingRef = ref(db, "chat/typing");

// ✅ DOM
const section = document.getElementById("discussion-section");
const startBtn = document.getElementById("startDiscussionBtn");
const loginBox = document.getElementById("discussion-login");
const nicknameDisplay = document.getElementById("nickname");
const confirmJoinBtn = document.getElementById("confirmJoinBtn");
const chatRoom = document.getElementById("chat-room");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const typingStatus = document.getElementById("typingStatus");
const selfTypingStatus = document.getElementById("selfTypingStatus");

let replyContext = null;
let nickname = "";

// ✅ Buat nickname
function generateNickname() {
  return "@who_" + Math.random().toString(36).substring(2, 6);
}

// ✅ Join Discussion
startBtn.addEventListener("click", () => {
  section.classList.remove("blur");
  loginBox.classList.remove("hidden");
  startBtn.classList.add("hidden");

  nickname = generateNickname();
  nicknameDisplay.textContent = nickname;
});

confirmJoinBtn.addEventListener("click", () => {
  loginBox.classList.add("hidden");
  chatRoom.classList.remove("hidden");

  const userTypingRef = ref(db, `chat/typing/${nickname}`);
  onDisconnect(userTypingRef).remove();
});

// ✅ Kirim pesan
sendBtn.addEventListener("click", () => {
  const text = chatInput.value.trim();
  if (!text || text.length > 500) return;

  const newMsg = push(messagesRef);
  set(newMsg, {
    sender: nickname,
    text,
    timestamp: serverTimestamp(),
    replyTo: replyContext
  });

  chatInput.value = "";
  replyContext = null;
  updateReplyUI();

  set(ref(db, `chat/typing/${nickname}`), null);
});


// ✅ Tampilkan pesan masuk
onChildAdded(messagesRef, (snapshot) => {
  const msg = snapshot.val();
  const msgTime = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  const isOwnMessage = msg.sender === nickname;

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  if (isOwnMessage) msgDiv.classList.add("own-message");

  msgDiv.innerHTML = `
    ${msg.replyTo ? `<div class="reply-ref">Reply to <strong>${msg.replyTo.sender}</strong>: <em>${msg.replyTo.text}</em></div>` : ""}
    <span class="sender">${msg.sender}</span>
    <div class="bubble-text">${msg.text}</div>
    <div class="bubble-footer">
      <span class="timestamp">${msgTime}</span>
      <button class="reply-btn" data-sender="${msg.sender}" data-text="${msg.text}">↩</button>
    </div>
  `;

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Event: reply button
  msgDiv.querySelector('.reply-btn').addEventListener("click", (e) => {
    const sender = e.target.dataset.sender;
    const text = e.target.dataset.text;
    replyContext = { sender, text };
    updateReplyUI();
  });
});


// ✅ Deteksi mengetik
let typingTimeout;

chatInput.addEventListener("input", () => {
  const isTyping = chatInput.value.trim() !== "";

  // Tampilkan indikator sendiri
  if (isTyping) {
    selfTypingStatus.classList.remove("hidden");
  } else {
    selfTypingStatus.classList.add("hidden");
  }

  // Update firebase
  set(ref(db, `chat/typing/${nickname}`), isTyping ? true : null);

  // Reset timeout
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    set(ref(db, `chat/typing/${nickname}`), null);
    selfTypingStatus.classList.add("hidden"); // sembunyikan indikator diri
  }, 2000);
});

// Deteksi user lain yang mengetik
onValue(typingRef, (snapshot) => {
  const typingUsers = snapshot.val() || {};
  const othersTyping = Object.keys(typingUsers).filter(name => name !== nickname);

  if (othersTyping.length > 0) {
    typingStatus.classList.remove("hidden");
    typingStatus.textContent = `${othersTyping.join(", ")} is typing...`;
  } else {
    typingStatus.classList.add("hidden");
    typingStatus.textContent = "";
  }
});

function updateReplyUI() {
  const preview = document.getElementById("replyPreview");

  if (replyContext) {
    preview.classList.remove("hidden");
    preview.innerHTML = `Replying to <strong>${replyContext.sender}</strong>: "${replyContext.text}"
      <button id="cancelReply">✖</button>`;

    document.getElementById("cancelReply").addEventListener("click", () => {
      replyContext = null;
      updateReplyUI();
    });
  } else {
    preview.classList.add("hidden");
    preview.innerHTML = "";
  }
}

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
