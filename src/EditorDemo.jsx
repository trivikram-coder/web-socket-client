import React, { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import socket from './socket/socket'

const EditorDemo = () => {
  const [code, setCode] = useState("console.log('Hello')")
  const [output, setOutput] = useState("")
  const[room,setRoom]=useState("")
  useEffect(() => {
    socket.on("receive-code", (data) => {
      setCode(data.code)
    })

    return () => {
      socket.off("receive-code")
    }
  }, [])

  function changeCode(value) {
    setCode(value)
    socket.emit("change-code", { code: value,roomId:room })
  }

  function runCode() {
    try {
      let logs = []
      const originalLog = console.log

      console.log = (...args) => {
        logs.push(args.join(" "))
      }

      eval(code)

      console.log = originalLog
      setOutput(logs.join("\n") || "No output")
    } catch (err) {
      setOutput(err.message)
    }
  }
  function joinRoom(){
    socket.emit("join-room",room)
    alert(socket.id+" Joined room "+room)
  }
  return (
    <div>
      <Editor
        height="79vh"
        language="javascript"
        value={code}
        theme="vs-dark"
        onChange={changeCode}
      />

      <br /><br />
      <input type="text" placeholder='Enter room' onChange={(e)=>setRoom(e.target.value)}/>
      <button onClick={joinRoom}>Join room</button>
      <button onClick={runCode}>Run ▶️</button>

      <p>Output:</p>
      <pre>{output}</pre>
    </div>
  )
}

export default EditorDemo
