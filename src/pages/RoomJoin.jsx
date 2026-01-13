import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import socket from '../socket/socket';
const RoomJoin = () => {
  const navigate=useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  function joinRoom(e) {
    e.preventDefault();
    

    navigate(`/chatpage/${roomId}`,{state:{userName}})
  }
  return (
    <div>
      <form className="join-form" onSubmit={joinRoom}>
          <input
            type="text"
            placeholder="Enter room Id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button type="submit">Join Room</button>
        </form>
    </div>
  )
}

export default RoomJoin
