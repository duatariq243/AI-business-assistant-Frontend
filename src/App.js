import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import ProgressAnalytics from "./components/ProgressAnalytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
              <Route
        path="/dashboard/:chatId/analytics"
        element={
          <ProtectedRoute>
            <ProgressAnalytics />
          </ProtectedRoute>
        }
      />

        {/* dashboard with optional chatId */}
        <Route
          path="/dashboard/:chatId?"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* redirect root to dashboard */}
        <Route path="/" element={<LandingPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
