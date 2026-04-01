import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Messages() {
  const navigate = useNavigate();
  const [savedChats, setSavedChats] = useState([]);

  useEffect(() => {
    const savedMatches = JSON.parse(localStorage.getItem("savedMatches") || "{}");
    const matchesData = JSON.parse(localStorage.getItem("lastViewedMatches") || "[]");

    const formattedChats = Object.entries(savedMatches).map(([userId, matchId]) => {
      const matchedUser = matchesData.find((m) => String(m.userId) === String(userId));

      return {
        userId,
        matchId,
        fullName: matchedUser?.fullName || "Traveler",
        destination:
          matchedUser?.destination ||
          matchedUser?.preferredDestination ||
          "Unknown destination",
        travelStyle: matchedUser?.travelStyle || "Not added",
      };
    });

    setSavedChats(formattedChats);
  }, []);

  const handleOpenChat = (chat) => {
    navigate(`/chat/${chat.matchId}`, {
      state: { receiverId: chat.userId },
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Messages</h1>
        <p className="text-slate-500">Open your saved conversations</p>
      </div>

      {savedChats.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          No saved chats yet. Go to Matches and connect with someone first.
        </div>
      ) : (
        <div className="space-y-4">
          {savedChats.map((chat) => (
            <div
              key={chat.matchId}
              className="rounded-2xl bg-white p-5 shadow-sm flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {chat.fullName}
                </h2>
                <p className="text-sm text-slate-500">{chat.destination}</p>
                <p className="text-sm text-slate-500">
                  Style: {chat.travelStyle}
                </p>
              </div>

              <button
                onClick={() => handleOpenChat(chat)}
                className="rounded-xl bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
              >
                Open Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}