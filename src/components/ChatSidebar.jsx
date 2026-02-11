import { useEffect, useState } from "react";
import { getChats, createChat, deleteChat, renameChat } from "../services/api"; // ensure renameChat exists in API
import { useNavigate, useParams } from "react-router-dom";
import "../css/ChatSidebar.css";
import { Link } from "react-router-dom";

function ChatSidebar() {
  const [chats, setChats] = useState([]);
  const [editingId, setEditingId] = useState(null); // chat being renamed
  const [newTitle, setNewTitle] = useState("");
  const navigate = useNavigate();
  const { chatId } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await getChats(token);
      setChats(res.data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const handleCreateChat = async () => {
    try {
      const res = await createChat({}, token);
      navigate(`/dashboard/${res.data.id}`);
      fetchChats();
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this chat?")) return;

    try {
      await deleteChat(id, token);
      if (chatId === String(id)) navigate("/dashboard");
      fetchChats();
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const handleRenameChat = async (chat) => {
    if (!newTitle.trim()) return;
    try {
      await renameChat(chat.id, newTitle, token);
      setEditingId(null);
      setNewTitle("");
      fetchChats();
    } catch (err) {
      console.error("Failed to rename chat:", err);
    }
  };

  return (
    <div className="chat-sidebar">
      <button className="new-chat-btn" onClick={handleCreateChat}>
        + New Chat
      </button>

      <ul className="chat-list">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className={`chat-item ${chatId === String(chat.id) ? "active" : ""}`}
            onClick={() => editingId !== chat.id && navigate(`/dashboard/${chat.id}`)}
          >
            <div className="chat-info">
              {editingId === chat.id ? (
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleRenameChat(chat)}
                  onKeyDown={(e) => e.key === "Enter" && handleRenameChat(chat)}
                  autoFocus
                  className="rename-input"
                />
              ) : (
                <div className="chat-title">{chat.title || "Untitled Chat"}</div>
              )}
              <div className="chat-time">
                {new Date(chat.created_at).toLocaleDateString()}
              </div>
            </div>

           <div className="chat-actions">
  {editingId !== chat.id && (
    <button
      className="rename-btn"
      onClick={(e) => {
        e.stopPropagation();
        setEditingId(chat.id);
        setNewTitle(chat.title || "");
      }}
    >
      Rename
    </button>
  )}

  {/* Analytics Button */}
  <button
    className="analytics-btn"
    onClick={(e) => {
      e.stopPropagation(); // prevent triggering sidebar click
      navigate(`/dashboard/${chat.id}/analytics`);
    }}
  >
    Analytics
  </button>

  <button
    className="delete-btn"
    onClick={(e) => handleDeleteChat(chat.id, e)}
  >
    ×
  </button>
</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatSidebar;
