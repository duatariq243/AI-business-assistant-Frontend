import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import "../css/Dashboard.css";

function Dashboard() {
  const { chatId } = useParams();

  // Example chat state
  const [chats] = useState([
    { id: "baking-business", title: "Baking Business" },
    { id: "marketing-business", title: "Marketing Business" }
  ]);

  // Find the selected chat
  const selectedChat = chats.find(c => c.id === chatId);

  return (
    <div className="dashboard-page">
      <Header />

      {/* Show analytics button only if a chat is selected */}
      {selectedChat && (
        <div className="chat-item">
          <h3>{selectedChat.title}</h3>
          <Link to={`/dashboard/${selectedChat.id}/analytics`}>
            <button>View Progress & Analytics</button>
          </Link>
        </div>
      )}

      <div className="dashboard-container">
        {/* LEFT – CHAT LIST */}
        <div className="dashboard-sidebar">
          <ChatSidebar chats={chats} />
        </div>

        {/* RIGHT – CHAT WINDOW */}
        <div className="dashboard-chatArea">
          {chatId ? (
            <ChatWindow chatId={chatId} />
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
