import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    preferredDestination: "",
    budgetRange: "",
    travelStyle: "",
    accommodationType: "",
    foodPreference: "",
    languagePreference: "",
    interests: "",
    availabilityStart: "",
    availabilityEnd: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const userId = localStorage.getItem("userId");

  // Fetch existing profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setFetching(false);
        return;
      }

      try {
        const response = await api.get(`/profile/${userId}`);
        const profile = response.data;
        
        // Pre-fill form with existing data
        setFormData({
          preferredDestination: profile.preferredDestination || "",
          budgetRange: profile.budgetRange || "",
          travelStyle: profile.travelStyle || "",
          accommodationType: profile.accommodationType || "",
          foodPreference: profile.foodPreference || "",
          languagePreference: profile.languagePreference || "",
          interests: profile.interests || "",
          availabilityStart: profile.availabilityStart || "",
          availabilityEnd: profile.availabilityEnd || "",
        });
      } catch (err) {
        // Profile doesn't exist - that's fine, form stays empty
        console.log("No existing profile, create new one");
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/profile", formData);
      navigate("/matches");
    } catch (err) {
      console.error("Profile setup error:", err);
      setError(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Set Up Your Travel Profile</h1>
        <p className="text-slate-500 mb-8">
          Tell us about your travel preferences so we can find better matches.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            name="preferredDestination"
            placeholder="Preferred destination"
            value={formData.preferredDestination}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
            required
          />

          <input
            name="budgetRange"
            placeholder="Budget range"
            value={formData.budgetRange}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
            required
          />

          <input
            name="travelStyle"
            placeholder="Travel style"
            value={formData.travelStyle}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
            required
          />

          <input
            name="accommodationType"
            placeholder="Accommodation type"
            value={formData.accommodationType}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            name="foodPreference"
            placeholder="Food preference"
            value={formData.foodPreference}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            name="languagePreference"
            placeholder="Language preference"
            value={formData.languagePreference}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            name="interests"
            placeholder="Interests (comma separated)"
            value={formData.interests}
            onChange={handleChange}
            className="col-span-2 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            type="date"
            name="availabilityStart"
            value={formData.availabilityStart}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            type="date"
            name="availabilityEnd"
            value={formData.availabilityEnd}
            onChange={handleChange}
            className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          {error && (
            <p className="col-span-2 text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="col-span-2 rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}