import { useEffect, useState, useRef } from "react";
import { getChatMessages, sendMessage } from "../services/api";
import ReactMarkdown from "react-markdown";
import "../css/ChatWindow.css";

function ChatWindow({ chatId , refreshChats,setChats }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const token = localStorage.getItem("token");
  const [limitReached, setLimitReached] = useState(false);
const [copiedId, setCopiedId] = useState(null);
const textareaRef = useRef();



  useEffect(() => {
    if (!chatId) return;

    setMessages([]);

   const fetchMessages = async () => {
    try {
      const res = await getChatMessages(chatId, token);
      const msgs = res.data.messages || [];

      

      setMessages(msgs);
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]);
    }
  };

  fetchMessages();
}, [chatId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const handleInputChange = (e) => {
  setInput(e.target.value);

  // Auto-expand logic
  textareaRef.current.style.height = "auto"; // reset height
  textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; // expand
};

const handleSend = async () => {
  if (!input.trim() || loading || limitReached) return;

  setLoading(true);

  try {
    const res = await sendMessage(chatId, input, token);

    // Add user + AI messages
    setMessages((prev) => [
      ...prev,
      { ...res.data.userMessage, role: "user" },
      { ...res.data.aiMessage, role: "ai" },
    ]);
if (res.data.chatTitle) {
  setChats(prevChats =>
    prevChats.map(chat =>
      chat.id === Number(chatId)
        ? { ...chat, title: res.data.chatTitle }
        : chat
    )
  );
}

    //  Now res exists — safe to check summary
    if (res.data.businessSummary) {
      setMessages((prev) => [
        ...prev,
        {
          id: `summary-${Date.now()}`,
          role: "system",
          content: `Business Insight Summary\n\n${res.data.businessSummary}`,
        },
      ]);
    }

   
    setInput("");
  } catch (err) {
    if (
      err.response?.status === 403 &&
      err.response?.data?.message.toLowerCase().includes("limit")
    ) {
      setLimitReached(true);
      setMessages((prev) => [
        ...prev,
        {
          id: "limit-reached",
          role: "system",
          content:
            "⚠️ You have reached the 20 message limit. Click 'New Chat' to continue.",
        },
      ]);
    } else {
      console.error(err);
    }
  } finally {
    setLoading(false);
  }
};

const handleCopy = (text, id) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2000); // tick stays for 2 sec
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
};

 

   return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`bubble ${
              msg.role === "user" || msg.role === "users"
                ? "user"
                : msg.role === "ai"
                ? "ai"
                : "system"
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>

            {msg.role === "ai" && (
              <div>
                <button
                  className={`copy-btn ${copiedId === msg.id ? "copied" : ""}`}
                  onClick={() => handleCopy(msg.content, msg.id)}
                >
                  {copiedId === msg.id ? "✔" : "Copy"}
                </button>

               
  
                  </div>
            )}
          </div>
        ))}

        {loading && <div className="typing">AI is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="input-box">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder={
            limitReached
              ? "Message limit reached. Start a new chat."
              : "Type your message..."
          }
          disabled={limitReached}
          className="chat-input"
          rows={1}
        />
        <button onClick={handleSend} disabled={loading || limitReached}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
