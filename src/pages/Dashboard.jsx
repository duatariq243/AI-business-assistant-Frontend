import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { getChats } from "../services/api"; // fetch chats from backend
import "../css/Dashboard.css";

function Dashboard() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

useEffect(() => {
  const fetchChats = async () => {
    const res = await getChats(token);
    setChats(res.data);
    setLoadingChats(false);
  };
  fetchChats();
}, [token]);


  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChats(token);
        setChats(res.data);

        // Auto-select first chat if no chatId in URL
        if (!chatId && res.data.length > 0) {
          navigate(`/dashboard/${res.data[0].id}`);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };

    fetchChats();
  }, [chatId, navigate, token]);
     
  const selectedChat = chats.find(c => c.id === chatId);

  

  return (
    <div className="dashboard-page">
      <Header />

      {/* Show analytics button only if a chat is selected */}
      {selectedChat && (
        <div className="chat-item">
          <h3>{selectedChat.title}</h3>
        </div>
      )}

      <div className="dashboard-container">
        {/* LEFT – CHAT LIST */}
        <div className="dashboard-sidebar">
          <ChatSidebar chats={chats} setChats={setChats} />
        </div>

        {/* RIGHT – CHAT WINDOW */}
        <div className="dashboard-chatArea">
          {chatId ? (
            <ChatWindow chatId={chatId} setChats={setChats} />
          ) : (
            <div className="dashboard-emptyState">
              <h2>Select or create a chat</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
