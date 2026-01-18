import React, { useState } from "react";
import EditorDemo from "./EditorDemo";
import ChatPage from "./ChatPage";
import UsersList from "./UsersList";
import "../styles/EditorPage.css";
import { useLocation, useParams } from "react-router-dom";

const EditorPage = () => {
const{roomId}=useParams();
const{state}=useLocation();
const userName=state?.userName;
  const [users, setUsers] = useState([]); // already coming from socket in ChatPage
console.log(userName)
  return (
    <div className="editor-layout">
      {/* TOP BAR */}
      <div className="top-bar">
        <span className="rooms-btn">📁 Rooms</span>
      </div>

      {/* BODY */}
      <div className="body">
        {/* LEFT – USERS */}
        <div className="left-panel">
          <h4>Collaborators</h4>
          <UsersList users={users} />
        </div>

        {/* CENTER – EDITOR */}
        <div className="center-panel">
          <EditorDemo roomId={roomId} userName={userName}/>
        </div>

        {/* RIGHT – CHAT */}
        <div className="right-panel">
          <ChatPage setUsers={setUsers} roomId={roomId} userName={userName}/>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
