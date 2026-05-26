import { Mycontext } from "./context";
import { AuthContext } from "./auth-context-core";
import { AuthProvider } from "./authContext";
import Sidebar from "./sidebar";
import Chatwindow from "./chatwindow";
import Login from "./login";
import Register from "./register";
import "./App.css";
import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function ChatApp() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [currentThreadId, setCurrentThreadId] = useState(uuidv4());
  const [previouschats, setPreviousChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt,
    setPrompt,
    response,
    setResponse,
    currentThreadId,
    setCurrentThreadId,
    previouschats,
    setPreviousChats,
    newChat,
    setNewChat,
    allThreads,
    setAllThreads,
  };

  return (
    <div className="app">
      <Mycontext.Provider value={providerValues}>
        <Sidebar />
        <Chatwindow />
      </Mycontext.Provider>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#212121",
          color: "#fff",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/chat" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}



