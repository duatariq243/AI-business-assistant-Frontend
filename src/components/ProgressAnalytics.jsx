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
  LineChart,
  Line,
} from "recharts";
import "../css/ProgressAnalytics.css"; // make sure the CSS file is in the same folder or adjust path

const COLORS = ["#6b5b95", "#feb236", "#d64161", "#ff7b25"];

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
          dailyMessages: [
            { day: "Mon", messages: 0 },
            { day: "Tue", messages: 0 },
            { day: "Wed", messages: 0 },
            { day: "Thu", messages: 0 },
            { day: "Fri", messages: 0 },
          ],
          userVsAi: [{ name: "User", value: 0 }, { name: "AI", value: 0 }],
          revenueTrend: [
            { day: "Mon", revenue: 1000, expenses: 500 },
            { day: "Tue", revenue: 1500, expenses: 700 },
            { day: "Wed", revenue: 1200, expenses: 400 },
            { day: "Thu", revenue: 2000, expenses: 800 },
            { day: "Fri", revenue: 1800, expenses: 600 },
          ],
          customerGrowth: [
            { day: "Mon", newCustomers: 5, churn: 1 },
            { day: "Tue", newCustomers: 8, churn: 2 },
            { day: "Wed", newCustomers: 6, churn: 1 },
            { day: "Thu", newCustomers: 10, churn: 3 },
            { day: "Fri", newCustomers: 7, churn: 1 },
          ],
          recentInsights: ["Revenue up 15% vs last week", "Product X underperforming"],
          topKeywords: ["marketing", "AI", "sales"],
          milestones: [
            { name: "Monthly Revenue", target: 50000, achieved: 32000 },
            { name: "New Customers", target: 200, achieved: 150 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [chatId]);

  if (loading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>No analytics data available.</p>;

  return (
    <div className="analytics-container">
      <button className="back-btn" onClick={() => window.history.back()}>Back</button>

      <h1>Analytics for Chat "{analytics.chatTitle || chatId}"</h1>

      {/* KPI Cards */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Messages</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{analytics.totalMessages}</p>
        </div>
        <div className="card">
          <h3>AI Suggestions</h3>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>{analytics.aiSuggestions}</p>
        </div>
        <div className="card">
          <h3>Business Growth</h3>
          <p>{analytics.growth}</p>
        </div>
        <div className="card">
        <h3>Total Revenue</h3>
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>
          ${analytics.revenueTrend?.reduce((sum, r) => sum + r.revenue, 0) || 0}
        </p>
      </div>

      </div>

      {/* Progress Tracking */}
      <div style={{ marginTop: "40px" }}>
        <h2>Progress Towards Milestones</h2>
        {(analytics.milestones || []).map((m, idx) => {
          const percent = Math.min(100, Math.round((m.achieved / m.target) * 100));
          return (
            <div key={idx} style={{ marginBottom: "15px" }}>
              <h4>{m.name}: ${m.achieved} / ${m.target}</h4>
              <div style={{ background: "#ddd", borderRadius: "5px", height: "20px" }}>
                <div
                  style={{
                    width: `${percent}%`,
                    background: "#6b5b95",
                    height: "100%",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
</div>

      {/* Charts Section */}
      <div style={{ display: "flex", gap: "40px", marginTop: "50px", flexWrap: "wrap" }}>
        {/* Revenue & Expenses */}
        <div style={{ flex: 1, minWidth: "400px" }}>
          <h2>Revenue & Expenses Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#6b5b95" />
              <Line type="monotone" dataKey="expenses" stroke="#feb236" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth */}
        <div style={{ flex: 1, minWidth: "400px" }}>
          <h2>Customer Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="newCustomers" fill="#6b5b95" />
              <Bar dataKey="churn" fill="#d64161" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User vs AI */}
        <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={analytics.userVsAi || []}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {(analytics.userVsAi || []).map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
       
      </div>

      {/* AI Insights */}
            <div style={{ marginTop: "50px" }}>
        <h2>AI Insights</h2>
        {(analytics.recentInsights || []).length ? (
          <ul>
            {(analytics.recentInsights || []).map((insight, idx) => (
              <li key={idx} style={{ marginBottom: "10px" }}>
                {insight}
              </li>
            ))}
          </ul>
        ) : (
          <p>No insights available.</p>
        )}
      </div>

        {/* Top Keywords */}
    <div style={{ marginTop: "50px" }}>
      <h2>Top Keywords</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {(analytics.topKeywords || []).map((kw, idx) => (
          <span
            key={idx}
            style={{
              background: "#6b5b95",
              color: "white",
              padding: "5px 10px",
              borderRadius: "5px",
            }}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
    </div>
  );
}

export default ProgressAnalytics;
