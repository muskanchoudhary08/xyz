import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    const response = await api.post("/auth/login", {
      email: formData.email,
      password: formData.password,
    });

    console.log("Login success:", response.data);

    // 🔐 Save data
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }

    if (response.data?.userId) {
      localStorage.setItem("userId", response.data.userId);
    }

    if (response.data?.fullName) {
      localStorage.setItem("fullName", response.data.fullName);
    }

    // 🚀 Redirect
   navigate("/matches");

  } catch (err) {
    console.error("Login error:", err);
    setError(
      err.response?.data?.detail ||
      "Login failed. Check your email or password."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-white px-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-500">
              Continue your journey with your perfect travel companion
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="text-right">
              <button type="button" className="text-sm text-sky-600 hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-sky-600 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      <div className="w-1/2 bg-slate-200 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
          alt="Travel"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}