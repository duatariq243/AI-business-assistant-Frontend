import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getChatAnalytics } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6b5b95", "#feb236"];

function ProgressAnalytics() {
  const { chatId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getChatAnalytics(chatId, token);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
        setAnalytics({
          totalMessages: 0,
          growth: "No data yet",
          aiSuggestions: 0,
          dailyMessages: [],
          userVsAi: [{ name: "User", value: 0 }, { name: "AI", value: 0 }],
          recentInsights: [],
          topKeywords: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [chatId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>No analytics data available.</p>;

  const chartData = analytics.dailyMessages.length
    ? analytics.dailyMessages
    : [
        { day: "Mon", messages: 0 },
        { day: "Tue", messages: 0 },
        { day: "Wed", messages: 0 },
        { day: "Thu", messages: 0 },
        { day: "Fri", messages: 0 },
      ];

  // Pie chart data: User vs AI
  const userVsAiData = analytics.userVsAi || [
    { name: "User", value: 0 },
    { name: "AI", value: 0 },
  ];

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Analytics for Chat "{analytics.chatTitle || chatId}"</h1>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: 1, padding: "20px", background: "#f2f2f2", borderRadius: "10px" }}>
          <h3>Total Messages</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{analytics.totalMessages}</p>
        </div>
        <div style={{ flex: 1, padding: "20px", background: "#f2f2f2", borderRadius: "10px" }}>
          <h3>AI Suggestions</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{analytics.aiSuggestions}</p>
        </div>
        <div style={{ flex: 1, padding: "20px", background: "#f2f2f2", borderRadius: "10px" }}>
          <h3>Business Growth</h3>
          <p style={{ fontSize: "18px" }}>{analytics.growth}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: "flex", gap: "40px", marginTop: "50px", flexWrap: "wrap" }}>
        {/* Messages Over Time */}
        <div style={{ flex: 1, minWidth: "400px" }}>
          <h2>Messages Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#6b5b95" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User vs AI */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h2>User vs AI Messages</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userVsAiData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {userVsAiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div style={{ marginTop: "50px" }}>
        <h2>Recent AI Insights</h2>
        {analytics.recentInsights && analytics.recentInsights.length > 0 ? (
          <ul>
            {analytics.recentInsights.map((insight, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                {insight}
              </li>
            ))}
          </ul>
        ) : (
          <p>No insights available yet.</p>
        )}
      </div>

      {/* Top Keywords */}
      <div style={{ marginTop: "50px" }}>
        <h2>Top Keywords</h2>
        {analytics.topKeywords && analytics.topKeywords.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {analytics.topKeywords.map((keyword, idx) => (
              <span
                key={idx}
                style={{
                  background: "#6b5b95",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p>No keywords data yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProgressAnalytics;
