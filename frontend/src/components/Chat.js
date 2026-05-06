// frontend/src/components/Chat.js

import React, { useState } from "react";

function Chat() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {

    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input.trim(),
          }),
        }
      );

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.answer,
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {

      console.error("Chat error:", err);

    } finally {

      setLoading(false);
    }

    setInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        marginTop: "25px",
      }}
    >

      <h3
        style={{
          marginBottom: "15px",
          color: "#111827",
        }}
      >
        💬 Chat With PDF
      </h3>

      {/* MESSAGES */}

      <div
        style={{
          flex: 1,
          maxHeight: "300px",
          overflowY: "auto",
          paddingRight: "10px",
        }}
      >

        {messages.map((msg, idx) => (

          <div
            key={idx}
            style={{
              marginBottom: "12px",
              textAlign:
                msg.sender === "user"
                  ? "right"
                  : "left",
            }}
          >

            <span
              style={{
                display: "inline-block",
                padding: "12px 16px",

                background:
                  msg.sender === "user"
                    ? "#2563eb"
                    : "#f3f4f6",

                color:
                  msg.sender === "user"
                    ? "white"
                    : "#111827",

                borderRadius: "16px",

                lineHeight: "1.5",

                boxShadow:
                  "0 1px 4px rgba(0,0,0,0.08)",

                maxWidth: "85%",

                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && (
          <p style={{ color: "#2563eb" }}>
            AI is thinking...
          </p>
        )}

      </div>

      {/* INPUT */}

      <div
        style={{
          marginTop: "15px",
          display: "flex",
          gap: "10px",
        }}
      >

        <input
          placeholder="Ask something about PDF..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" && handleSend()
          }
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "14px",
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: "14px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Send
        </button>

      </div>
    </div>
  );
}

export default Chat;