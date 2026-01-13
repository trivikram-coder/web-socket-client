import React, { useEffect, useRef, useState } from "react";
import "../styles/ChatPage.css";
import socket from "../socket/socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const ChatPage = () => {
  const navigate=useNavigate()
  const {roomId}=useParams();
  const{state}=useLocation();
  const userName=state?.userName;
  const [message, setMessage] = useState("");
  
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  
  const chatEndRef=useRef(null)
  useEffect(()=>{
if (!roomId || !userName) return;

    socket.emit("join-room", {
       roomId,
      userName,
    });
    
  },[roomId,userName])
  useEffect(()=>{
   socket.emit("get-chats",roomId)
  },[roomId])
  useEffect(() => {
    
    socket.on("connect", () => {
      console.log("User connected with id " + socket.id);
    });

    socket.on("room-users", (data) => {
      setUsers(data); // expects array
    });

    socket.on("receive-message", (data) => {
      setChats(data.chats); // expects array of messages
    });

    return () => {
      socket.off("room-users");
      socket.off("receive-message");
    };
  }, []);
useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  

  function sendMessage() {
    if (!message.trim()) return;

    socket.emit("send-message", {
      roomId,
      userName,
      message,
    });

    setMessage("");
  }
  function leaveRoomHandler(){
    if(!roomId)return;
    socket.emit("leave-room",{roomId,userName})
    navigate("/")
  }

  return (
    <>
      
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <h3>Room: {roomId}</h3>
            <span className="show-user">{userName}</span>
            <span className="online-status">● Online</span>
            <button onClick={leaveRoomHandler}>Leave room</button>
          </div>

          {/* Users */}
          <div className="users-list">
            <h4>Users</h4>
            {users.map((u, index) => (
              <div key={index} className="user-item">
                {u.userName || u}
              </div>
            ))}
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {chats.map((chat, index) => (
              <div
                key={index}
                className={`message ${
                  chat.userName === userName ? "sent" : "received"
                }`}
              >
                <span className="user">
                  {chat.userName === userName ? "You" : chat.userName}
                </span>
                <p>{chat.text || chat.message}</p>
              </div>
            ))}
          {/* 👇 SCROLL TARGET */}
          
            <div ref={chatEndRef} />
          </div>
          {/* Input */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
    
    </>
  );
};

export default ChatPage;
