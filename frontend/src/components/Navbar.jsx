import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const fullName = localStorage.getItem("fullName") || "Traveler";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = (() => {
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
    return notifications.filter((n) => !n.isRead).length;
  })();

  const linkClass = (path) =>
    `rounded-xl px-4 py-2 text-sm font-medium transition ${
      location.pathname === path
        ? "bg-sky-500 text-white"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullName");
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (localStorage.getItem("token")) {
      navigate("/matches");
    } else {
      navigate("/");
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">

          <span
            onClick={handleLogoClick}
            className="text-2xl font-bold text-sky-600 cursor-pointer"
          >
            Tripzy
          </span>

          <nav className="flex items-center gap-2">
            <Link to="/matches" className={linkClass("/matches")}>Matches</Link>
            <Link to="/messages" className={linkClass("/messages")}>Messages</Link>
            <Link to="/profile-setup" className={linkClass("/profile-setup")}>Profile</Link>
            <Link to="/subscription" className={linkClass("/subscription")}>Subscription</Link>
            <Link to="/payments" className={linkClass("/payments")}>Payments</Link>
            <Link to="/reviews" className={linkClass("/reviews")}>Reviews</Link>
            <Link to="/notifications" className={linkClass("/notifications")}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 hover:bg-slate-50"
          >
            <div className="h-8 w-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-sm">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-slate-800">{fullName}</span>
            <span className="text-slate-400">▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-slate-200 z-50">
              <div className="p-2">
                <p className="px-3 py-2 text-xs text-slate-400 font-medium uppercase">
                  Account
                </p>
                <Link
                  to="/profile-setup"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ✏️ Edit Profile
                </Link>
                <Link
                  to="/matches"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  🧭 My Matches
                </Link>
                <Link
                  to="/subscription"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  ⭐ Subscription
                </Link>
                <hr className="my-1 border-slate-100" />
                <button
                  onClick={() => { setDropdownOpen(false); handleLogout(); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}