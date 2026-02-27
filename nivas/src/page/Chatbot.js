import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* ================= VOICE INPUT ================= */

function startVoiceInput(setInput, language) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported in this browser");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang =
    language === "Tamil"
      ? "ta-IN"
      : language === "Hindi"
      ? "hi-IN"
      : "en-US";

  recognition.start();

  recognition.onresult = (event) => {
    setInput(event.results[0][0].transcript);
  };
}

/* ================= CHATBOT ================= */

export default function Chatbot({ issueType, image }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [language, setLanguage] = useState("English");

  const messagesEndRef = useRef(null);

  /* Auto Scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message: userMessage.text,
          language,
          issueType,
        }
      );

      const aiMessage = {
        sender: "ai",
        text: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Sorry, something went wrong. Please try again.",
        },
      ]);
    }

    setTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-xl z-50"
      >
        💬
      </button>

      {/* Chat Drawer */}
      {open && (
        <div className="fixed bottom-0 right-0 md:top-0 md:h-full w-full md:w-96 bg-white shadow-2xl flex flex-col z-50 transition-all duration-300 rounded-t-2xl md:rounded-none">

          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
            <h3 className="font-semibold">Civic AI Assistant</h3>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">

            {/* Image Preview */}
            {image && (
              <img
                src={URL.createObjectURL(image)}
                className="rounded-xl shadow-md mb-2"
                alt="preview"
              />
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow ${
                  msg.sender === "user"
                    ? "bg-emerald-500 text-white ml-auto"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="bg-white px-4 py-2 rounded-2xl shadow text-gray-500 text-sm animate-pulse w-fit">
                AI is typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Language Switch */}
          <div className="px-4 py-2 border-t bg-white">
            <select
              className="border px-2 py-1 rounded text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Tamil</option>
              <option>Hindi</option>
            </select>
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2 bg-white">
            <button
              onClick={() => startVoiceInput(setInput, language)}
              className="text-xl"
            >
              🎤
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-xl px-3 py-2 focus:ring-2 focus:ring-emerald-400 outline-none"
              placeholder="Ask about this issue..."
            />

            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-4 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}