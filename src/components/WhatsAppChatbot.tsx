"use client";

import { useState } from "react";

const WhatsAppChatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#25D366",
          color: "white",
          borderRadius: "50%",
          padding: "15px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
          zIndex: 1000,
        }}
      >
        💬
      </button>

      {/* Chatbot Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "#25D366",
              color: "white",
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>AiSensy Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          <iframe
            src={`https://app.aisensy.com/chatbot/${import.meta.env.VITE_AISENSY_API_KEY}`}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      )}
    </>
  );
};

export default WhatsAppChatbot;
