import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { addNotification } from "../utils/notifications";

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [connectError, setConnectError] = useState("");
  const [loading, setLoading] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(
    JSON.parse(localStorage.getItem("blockedUsers") || "[]")
  );

  const fetchMatches = async () => {
    try {
      setError("");
      const response = await api.get("/matches");
      setMatches(response.data || []);
    } catch (err) {
      console.error("Fetch matches error:", err);
      setError(err.response?.data?.detail || "Failed to load matches.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleConnect = async (user2Id, matchId) => {
    setConnectError("");

    if (matchId) {
      const savedMatches = JSON.parse(localStorage.getItem("savedMatches") || "{}");
      savedMatches[user2Id] = matchId;
      localStorage.setItem("savedMatches", JSON.stringify(savedMatches));

      const lastViewed = JSON.parse(localStorage.getItem("lastViewedMatches") || "[]");
      const matchInfo = matches.find((m) => m.userId === user2Id);

      if (matchInfo && !lastViewed.find((m) => m.userId === user2Id)) {
        lastViewed.push(matchInfo);
        localStorage.setItem("lastViewedMatches", JSON.stringify(lastViewed));
      }

      navigate(`/chat/${matchId}`, { state: { receiverId: user2Id } });
      return;
    }

    try {
      const response = await api.post("/matches", { user2Id });
      const newMatchId =
        response.data?.matchId ||
        response.data?.match_id ||
        response.data?.id;

      if (newMatchId) {
        addNotification({
          title: "New Match",
          message: "You connected with a traveler successfully.",
          type: "match",
        });

        const savedMatches = JSON.parse(localStorage.getItem("savedMatches") || "{}");
        savedMatches[user2Id] = newMatchId;
        localStorage.setItem("savedMatches", JSON.stringify(savedMatches));

        const lastViewed = JSON.parse(localStorage.getItem("lastViewedMatches") || "[]");
        const matchInfo = matches.find((m) => m.userId === user2Id);

        if (matchInfo && !lastViewed.find((m) => m.userId === user2Id)) {
          lastViewed.push(matchInfo);
          localStorage.setItem("lastViewedMatches", JSON.stringify(lastViewed));
        }

        navigate(`/chat/${newMatchId}`, { state: { receiverId: user2Id } });
      } else {
        setConnectError("Could not create match. Please try again.");
      }
    } catch (err) {
      console.error("Connect error:", err);
      setConnectError(
        err.response?.data?.detail || "Could not connect. Please try again."
      );
    }
  };

  const handleBlock = (userId) => {
    const updated = [...blockedUsers, userId];
    setBlockedUsers(updated);
    localStorage.setItem("blockedUsers", JSON.stringify(updated));
  };

  const handleReview = (userId) => {
    navigate("/reviews", { state: { reviewedUserId: userId } });
  };

  if (loading) {
    return <div className="text-slate-600">Loading matches...</div>;
  }

  const visibleMatches = matches.filter(
    (m) => !blockedUsers.includes(m.userId)
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Your Matches</h1>
        <p className="text-slate-500">Find travelers with similar preferences.</p>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}
      {connectError && <p className="mb-4 text-red-500">{connectError}</p>}

      {visibleMatches.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-slate-600">
          No matches found yet. Try adjusting your travel profile.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleMatches.map((match) => (
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
                    {match.fullName || "Traveler"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {match.preferredDestination || "Traveler"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium">Match score:</span>{" "}
                  {match.matchScore ?? "N/A"}%
                </p>
                <p>
                  <span className="font-medium">Travel style:</span>{" "}
                  {match.travelStyle || "Not added"}
                </p>
                <p>
                  <span className="font-medium">Budget:</span>{" "}
                  {match.budgetRange || "Not added"}
                </p>
                <p>
                  <span className="font-medium">Interests:</span>{" "}
                  {match.interests || "Not added"}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleConnect(match.userId, match.matchId)}
                  className="flex-1 rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600"
                >
                  Connect / Chat
                </button>

                <button
                  onClick={() => handleReview(match.userId)}
                  className="rounded-xl bg-green-500 px-4 py-3 font-semibold text-white hover:bg-green-600"
                >
                  Review
                </button>

                <button
                  onClick={() => handleBlock(match.userId)}
                  className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}