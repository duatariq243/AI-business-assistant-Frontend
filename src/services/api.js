import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Auth endpoints
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// Chat endpoints
export const getChats = (token) =>
  API.get("/chat", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const createChat = (data, token) =>
  API.post("/chat", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

export const getChatMessages = (chatId, token) =>
  API.get(`/chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const sendMessage = (chatId, content, token) =>
  API.post(
    "/chat/message",
    { chatId, message: content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteChat = (chatId, token) =>
  API.delete(`/chat/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const renameChat = (chatId, title, token) =>
  API.patch(
    `/chat/${chatId}/rename`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } }
  );

//  Analytics endpoint
export const getChatAnalytics = (chatId, token) =>
  API.get(`/chat/analytics/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
