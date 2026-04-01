import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// AUTO ATTACH TOKEN TO EVERY REQUEST
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); // debug

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});


// ================= AUTH =================

export const signup = (data) => API.post("/auth/signup", data);

export const login = (data) => API.post("/auth/login", data);
export const verifyOTP = (data) => API.post("/auth/verify-otp", data);
export const resendOTP = (data) => API.post("/auth/resend-otp", data);


// ================= CHAT =================

//  NO TOKEN PARAM NEEDED ANYMORE

export const getChats = () => API.get("/chat");

export const createChat = (data) => API.post("/chat", data);

export const getChatMessages = (chatId) =>
  API.get(`/chat/${chatId}`);

export const sendMessage = (chatId, content) =>
  API.post("/chat/message", {
    chatId,
    message: content,
  });

export const deleteChat = (chatId) =>
  API.delete(`/chat/${chatId}`);

export const renameChat = (chatId, title) =>
  API.patch(`/chat/${chatId}/rename`, { title });

export const getChatAnalytics = (chatId) =>
  API.get(`/chat/analytics/${chatId}`);