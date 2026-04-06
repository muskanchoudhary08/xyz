import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Reviews() {
  const navigate = useNavigate();
  const [reviewedUserId, setReviewedUserId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/reviews", { reviewedUserId, rating: parseInt(rating), comment });
      setSuccess("Review submitted successfully!");
      setReviewedUserId("");
      setRating(5);
      setComment("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Leave a Review</h1>
        <p className="text-slate-500">Rate your travel companion after your trip.</p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">User ID to Review</label>
            <input
              type="text"
              placeholder="Paste the user's ID"
              value={reviewedUserId}
              onChange={(e) => setReviewedUserId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating (1-5)</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
            >
              <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
              <option value={4}>⭐⭐⭐⭐ - Good</option>
              <option value={3}>⭐⭐⭐ - Average</option>
              <option value={2}>⭐⭐ - Poor</option>
              <option value={1}>⭐ - Very Poor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}