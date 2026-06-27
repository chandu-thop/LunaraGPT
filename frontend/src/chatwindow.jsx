import { useContext, useState } from "react";
import "./chatwindow.css";
import api from "./api";
import { ScaleLoader } from "react-spinners";
import { Mycontext } from "./context";
import Chat from "./chat";

export default function Chatwindow() {
  const {
    prompt,
    setPrompt,
    setResponse,
    currentThreadId,
    setPreviousChats,
    setNewChat,
    newChat,
    setAllThreads,
  } = useContext(Mycontext);
  const [loader, setLoader] = useState(false);

  async function sendmessage() {
    const userPrompt = prompt.trim();

    if (!userPrompt || loader) {
      return;
    }

    setLoader(true);
    setPrompt("");
    setNewChat(false);
    const isFirstMessage = newChat;
    setPreviousChats((prev) => [
      ...prev,
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    try {
      const res = await api.post("/chat", {
        message: userPrompt,
        threadId: currentThreadId,
      });
      const reply = res.data.reply;

      setResponse(reply);
      setPreviousChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);

      // If this is the first message, add the thread to the sidebar
      if (isFirstMessage) {
        setAllThreads((prev) => [
          ...prev,
          { threadId: currentThreadId, title: userPrompt.substring(0, 30) },
        ]);
      }
    } catch (err) {
      console.log(err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.userMessage ||
        "Sorry, I could not send that message. Please try again.";

      setPreviousChats((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoader(false);
    }
  }

  return (
    <div className="chatwindow">
      <div className="chat-header">
        <p className="title">
          LunaraGPT
          <i className="fa-solid fa-angle-down down-icon"></i>
        </p>

        <i className="fa-regular fa-user user-icon"></i>
      </div>

      <div className="chat-body">
        <Chat />
        {loader && (
          <div className="loader-container">
            <ScaleLoader color="#cbd5e1" height={22} width={4} />
          </div>
        )}
      </div>

      <div className="chat-input-section">
        <div className="input-container">
          <input
            type="text"
            name="message"
            value={prompt}
            placeholder="Message LunaraGPT"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendmessage();
              }
            }}
          />

          <button
            onClick={sendmessage}
            className="send-btn"
            disabled={!prompt.trim() || loader}
            aria-label="Send message"
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
        </div>

        <p className="info">LunaraGPT can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}
