import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket/socket"
import UsersList from "../pages/UsersList";

const EditorDemo = () => {
  const [code, setCode] = useState("console.log('Hello')");
  const [output, setOutput] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);

  const isRemoteChange = useRef(false);

  /* -------------------- JOIN ROOM ON LOAD -------------------- */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.roomId) {
      socket.emit("join-room", {
        roomId: user.roomId,
        userName: user.userName,
      });
      setRoom(user.roomId);
    }
  }, []);

  /* -------------------- RECEIVE USERS -------------------- */
  useEffect(() => {
    const handleRoomUsers = (usersList) => {
      console.log("Users in room:", usersList);
      setUsers(usersList);
    };

    socket.on("room-users", handleRoomUsers);

    return () => {
      socket.off("room-users", handleRoomUsers);
    };
  }, []); // ✅ NO dependencies

  /* -------------------- RECEIVE CODE -------------------- */
  useEffect(() => {
    const handleReceiveCode = (data) => {
      isRemoteChange.current = true;
      setCode(data.code);
    };

    socket.on("receive-code", handleReceiveCode);

    return () => {
      socket.off("receive-code", handleReceiveCode);
    };
  }, []);

  /* -------------------- CODE CHANGE -------------------- */
  const changeCode = (value) => {
    if (value === undefined) return;

    setCode(value);

    if (isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    if (room) {
      socket.emit("change-code", {
        roomId: room,
        code: value,
      });
    }
  };

  /* -------------------- RUN CODE -------------------- */
  const runCode = () => {
    try {
      let logs = [];
      const originalLog = console.log;

      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      eval(code);

      console.log = originalLog;
      setOutput(logs.join("\n") || "No output");
    } catch (err) {
      setOutput(err.message);
    }
  };

  /* -------------------- LEAVE ROOM -------------------- */
  const leaveRoomHandler = () => {
    if (!room) return;

    socket.emit("leave-room", room);

    setRoom("");
    setUsers([]);
    setCode("// Left the room");
  };

  /* -------------------- CLEANUP ON UNMOUNT -------------------- */
  useEffect(() => {
    return () => {
      if (room) {
        socket.emit("leave-room", room);
      }
    };
  }, [room]);

  return (
    <div>
      <h3>Users in room:</h3>
      <UsersList users={users} />

      <Editor
        height="70vh"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={changeCode}
      />

      <br />

      <button onClick={leaveRoomHandler}>Leave Room</button>
      <button onClick={runCode}>Run ▶️</button>

      <p>Output:</p>
      <pre>{output}</pre>
    </div>
  );
};

export default EditorDemo;
