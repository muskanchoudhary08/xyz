import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function Chat() {
  const { id: matchId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [receiverId, setReceiverId] = useState(
    location.state?.receiverId || ""
  );
  const [error, setError] = useState("");

  const currentUserId = localStorage.getItem("userId");

  // 🔄 Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${matchId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.response?.data?.detail || "Failed to load messages.");
    }
  };

  // 🔁 Auto refresh every 3 sec
  useEffect(() => {
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [matchId]);

  // 📤 Send message
  const handleSend = async () => {
    if (!messageText.trim()) return;

    if (!receiverId) {
      alert("Receiver ID missing. Open chat from Matches page.");
      return;
    }

    try {
      await api.post("/messages", {
        matchId,
        receiverId,
        messageText,
      });

      setMessageText("");
      fetchMessages();
    } catch (err) {
      console.error("Send message error:", err);
      alert(err.response?.data?.detail || "Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate("/matches")}
          className="mb-4 rounded-xl border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
        >
          ← Back to Matches
        </button>

        <div className="flex h-[80vh] flex-col rounded-3xl bg-white shadow-sm">

          {/* 🔹 Header */}
          <div className="border-b border-slate-200 p-5">
            <h1 className="text-2xl font-bold text-slate-800">Chat</h1>
            <p className="text-sm text-slate-500">
              Match ID: {matchId}
            </p>
          </div>

          {/* 💬 Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {error && <p className="text-red-500">{error}</p>}

            {messages.length === 0 ? (
              <p className="text-slate-500">
                No messages yet. Start the conversation 👋
              </p>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === currentUserId;

                return (
                  <div
                    key={msg.messageId}
                    className={`max-w-xs rounded-2xl px-4 py-3 ${
                      isMine
                        ? "ml-auto bg-sky-500 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {msg.messageText}

                    <div className="mt-1 text-xs opacity-70">
                      {isMine ? "You" : "Them"}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ✉️ Input */}
          <div className="border-t border-slate-200 p-4">
            {!receiverId && (
              <p className="mb-2 text-sm text-amber-600">
                Receiver ID missing. Please open chat from Matches page.
              </p>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              />

              <button
                onClick={handleSend}
                className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600"
              >
                Send
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}