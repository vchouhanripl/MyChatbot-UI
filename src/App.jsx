// src/App.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8080/chat/history").then((res) => {
      setMessages(res.data.map(m => ({ user: m.userInput, bot: m.aiResponse })));
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages([...messages, { user: userMsg, bot: "..." }]);

    const res = await axios.post("http://localhost:8080/chat", { userInput: userMsg });
    setMessages((prev) => [...prev.slice(0, -1), { user: userMsg, bot: res.data.aiResponse }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Chatbot</h1>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-4 space-y-4 overflow-y-auto h-[500px]">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="text-blue-700 font-semibold">You: {m.user}</p>
            <p className="text-gray-800">Bot: {m.bot}</p>
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-2xl mt-4">
        <input
          className="flex-1 border p-2 rounded-l-lg"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;