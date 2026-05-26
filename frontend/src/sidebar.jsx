import "./sidebar.css"; 
import logoImg from "./assets/logo.png";
import { useCallback, useContext, useEffect } from "react";
import { Mycontext } from "./context";
import { AuthContext } from "./auth-context-core";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar(){
    const {allThreads,setAllThreads,currentThreadId,setPrompt,setResponse,setCurrentThreadId,setPreviousChats,setNewChat}=useContext(Mycontext);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const getAllThreads = useCallback(async () => {
        try{
            const res=await api.get("/thread");
            const filterdata=res.data.map(thread=>({threadId:thread.threadId,title:thread.title}));
           setAllThreads(filterdata);

        }catch(err){
            console.log(err);
            
        }

    }, [setAllThreads]);

    useEffect(()=>{
        getAllThreads();
    },[getAllThreads]);

    function handleClick(){
        setNewChat(true);
        setPrompt("");
        setResponse(null);
        setCurrentThreadId(uuidv4());
        setPreviousChats([]);
    }

    async function changeThread(newThreadId){
        setCurrentThreadId(newThreadId);
        setResponse(null);
        try{
           let data= await api.get(`/thread/${newThreadId}`);
           setPreviousChats(data.data);
           setNewChat(false);
        }catch(err){
            console.log(err);
        }
    }

    async function handledelete(threadId){
       await api.delete(`/thread/${threadId}`);
       getAllThreads();
       if(threadId===currentThreadId){
        setNewChat(true);
        setPrompt("");
        setResponse(null);
        setCurrentThreadId(uuidv4());
        setPreviousChats([]);
       }
    }

    function handleLogout(){
        logout();
        navigate("/login");
    }

    return(
        <>
        <section className="sidebar">
             {/*new chat button*/}
        <button className="new-chat-btn" onClick={handleClick}>
            <img className="logo" src={logoImg} alt="logo" />
            <span>New chat</span>
            <i className="fa-solid fa-pen-to-square icon"></i>
        </button>
        <ul className="history">
           {
            allThreads.map((thread)=>(
                  <li key={thread.threadId} className={thread.threadId === currentThreadId ? "active" : ""}>
                     <button className="thread-btn" onClick={()=>{changeThread(thread.threadId)}}>{thread.title}</button>
                     <button className="delete-btn" aria-label={`Delete ${thread.title}`} onClick={()=>{handledelete(thread.threadId)}}><i className="fa-solid fa-trash"></i></button>
                  </li>
            ))
           }
        </ul>
        <div className="bottom-section">
            <div className="user-info">
                <p className="username">{user?.username || "User"}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                <i className="fa-solid fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
        </div>

        </section>
       
        </>
    );
}
