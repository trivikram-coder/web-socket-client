import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket/socket";
import { useLocation, useParams } from "react-router-dom";
import "../styles/Editor.css";

const EditorDemo = () => {
  const languages = [
    "javascript",
    "typescript",
    "html",
    "css",
    "java",
    "python",
  ];

  const codeTemplates = {
    javascript: "console.log('Hello');",
    typescript: "let x: number = 10;\nconsole.log(x);",
    html: "<!DOCTYPE html>\n<html>\n  <body>\n    <h1>Hello</h1>\n  </body>\n</html>",
    css: "body {\n  margin: 0;\n}",
    java:
      "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello\");\n  }\n}",
    python: "print('Hello')",
  };

  const { roomId } = useParams();
  const { state } = useLocation();
  const userName = state?.userName;
  const[loading,setLoading]=useState(false)
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(codeTemplates.javascript);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!roomId || !userName) return;
    socket.emit("join-room", { roomId, userName });
  }, [roomId, userName]);

  const handleChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(codeTemplates[lang]);
  };

  // Dummy run (replace with API call)
  const handleRun = async() => {
    setLoading(true)
    const response=await fetch("http://localhost:3000/run",{
      method:"POST",
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify({language,code})
    })
    if(response.status===200){
      const data=await response.json();
      setStatus(data.status)
      setOutput(data.output);
      setLoading(false)
    }
  };

  return (
    <div className="editor-page">
      {/* HEADER */}
      <div className="editor-header">
        <div className="left">
          <span className="user">👤 {userName}</span>
          <span className="room">Room: {roomId}</span>
        </div>
        <div className="right">
          <span className="status-online">🟢 Online</span>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="editor-toolbar">
        <select
          className="language-select"
          value={language}
          onChange={handleLanguageChange}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        <button className="run-btn" onClick={handleRun}>
          {!loading?(<span>▶ Run</span> ):(
            <span>Running....</span>
          )}
        </button>
      </div>

      {/* MAIN */}
      <div className="editor-main">
        {/* CODE EDITOR */}
        <div className="editor-wrapper">
          <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={code}
            onChange={handleChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              autoClosingBrackets: "always",
              autoIndent: "full",
              quickSuggestions: false, // LeetCode style
              suggestOnTriggerCharacters: false,
            }}
          />
        </div>

        {/* OUTPUT */}
        <div className="output-wrapper">
          <div className="output-header">
            Output
            {status && (
              <span
                className={
                  status === "success"
                    ? "output-success"
                    : "output-error"
                }
              >
                {status}
              </span>
            )}
          </div>

          <pre className="output-box">{output || "Run code to see output"}</pre>
        </div>
      </div>
    </div>
  );
};

export default EditorDemo;
