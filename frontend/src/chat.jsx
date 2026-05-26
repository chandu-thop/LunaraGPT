import { useContext, useEffect, useState } from "react";
import { Mycontext } from "./context";
import "./chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function Chat() {
  const { newChat, previouschats,response } = useContext(Mycontext);
  const [latestReply,setLatestReply]=useState("");
  useEffect(()=>{
    const resetLatestReply = () => {
      setLatestReply("");
    };

    if(response===null){
    queueMicrotask(resetLatestReply);
    return;
   }
 if (!previouschats?.length || !response) {
    queueMicrotask(resetLatestReply);
    return;
 }
   
   
    const content=response.split(" ");
    let index=0;
    let interval=setInterval(()=>{
      
        setLatestReply(content.slice(0,index+1).join(" "));
        index++;
        if(index>=content.length){
          clearInterval(interval);
        }
    },40);
    return ()=>clearInterval(interval);
  },[previouschats,response]);

  return (
    <div className="chats">
      {newChat && previouschats.length === 0 && (
        <div className="empty-chat">
          <p className="empty-eyebrow">LunaraGPT</p>
          <h1>What can we explore today?</h1>
        </div>
      )}
{previouschats.map((chat, index) => {
        // Skip the last message if latestReply is being animated
        if (latestReply && index === previouschats.length - 1 && chat.role === "assistant") {
          return null;
        }
        return (
          <article key={index} className={`chat-message ${chat.role}`}>
            <div className="message-avatar" aria-hidden="true">
              {chat.role === "user" ? "U" : "L"}
            </div>

            <div className="message-content">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {chat.content}
              </ReactMarkdown>
            </div>
          </article>
        );
      })}
      {
  previouschats.length > 0 && latestReply && (
    <article className="chat-message assistant">
      <div className="message-avatar">L</div>

      <div className="message-content">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {latestReply}
        </ReactMarkdown>
      </div>
    </article>
  )
}
    </div>
  );
}
