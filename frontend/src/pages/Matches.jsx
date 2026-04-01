import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { addNotification } from "../utils/notifications";

export default function Matches() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setError("");
      const response = await api.get("/matches");
      setMatches(response.data || []);
      localStorage.setItem("lastViewedMatches", JSON.stringify(response.data || []));
    } catch (err) {
      console.error("Fetch matches error:", err);
      const detail = err.response?.data?.detail;

      if (detail === "Complete your travel profile first") {
        navigate("/profile-setup");
        return;
      }

      setError(detail || "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleConnect = async (user2Id) => {
    try {
      const response = await api.post("/matches", { user2Id });

      const matchId =
        response.data?.matchId ||
        response.data?.match_id ||
        response.data?.id;

      if (!matchId) {
        alert("No match ID returned.");
        return;
      }

      const savedMatches = JSON.parse(localStorage.getItem("savedMatches") || "{}");
      savedMatches[user2Id] = matchId;
      localStorage.setItem("savedMatches", JSON.stringify(savedMatches));

      addNotification({
        title: "New Match",
        message: "You connected with a traveler successfully.",
        type: "match",
      });

      navigate(`/chat/${matchId}`, {
        state: { receiverId: user2Id },
      });
    } catch (err) {
      console.error("Connect error:", err);

      if (err.response?.status === 409) {
        try {
          const savedMatches = JSON.parse(localStorage.getItem("savedMatches") || "{}");
          const savedMatchId = savedMatches[user2Id];

          if (savedMatchId) {
            navigate(`/chat/${savedMatchId}`, {
              state: { receiverId: user2Id },
            });
            return;
          }

          const matchesRes = await api.get("/matches");
          const existing = (matchesRes.data || []).find((m) => m.userId === user2Id);

          const existingMatchId =
            existing?.matchId ||
            existing?.match_id ||
            existing?.id;

          if (!existingMatchId) {
            alert("Already connected, but match ID is not available from backend.");
            return;
          }

          const updatedSavedMatches = JSON.parse(
            localStorage.getItem("savedMatches") || "{}"
          );
          updatedSavedMatches[user2Id] = existingMatchId;
          localStorage.setItem("savedMatches", JSON.stringify(updatedSavedMatches));

          navigate(`/chat/${existingMatchId}`, {
            state: { receiverId: user2Id },
          });
        } catch (fetchErr) {
          console.error("Failed to resolve existing match:", fetchErr);
          alert("Already connected, but could not open existing chat.");
        }
      } else {
        alert(err.response?.data?.detail || "Could not connect.");
      }
    }
  };

  if (loading) {
    return <div className="text-slate-600">Loading matches...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Your Matches</h1>
        <p className="text-slate-500">Find travelers with similar preferences.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Matches</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">{matches.length}</h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Saved Chats</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {Object.keys(JSON.parse(localStorage.getItem("savedMatches") || "{}")).length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Unread Notifications</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            {JSON.parse(localStorage.getItem("notifications") || "[]").filter((n) => !n.isRead).length}
          </h2>
        </div>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {matches.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          No matches found yet. Try adjusting your travel profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {matches.map((match) => (
            <div key={match.userId} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden">
                  {match.profilePhoto ? (
                    <img
                      src={match.profilePhoto}
                      alt={match.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    {match.fullName}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {match.destination || match.preferredDestination || "Traveler"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">Match score:</span> {match.matchScore ?? "N/A"}%</p>
                <p><span className="font-medium">Travel style:</span> {match.travelStyle || "Not added"}</p>
                <p><span className="font-medium">Budget:</span> {match.budgetRange || "Not added"}</p>
                <p><span className="font-medium">Interests:</span> {match.interests || "Not added"}</p>
              </div>

              <button
                onClick={() => handleConnect(match.userId)}
                className="mt-5 w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600"
              >
                Connect / Open Chat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}