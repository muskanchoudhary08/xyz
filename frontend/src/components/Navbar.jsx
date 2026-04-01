import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const fullName = localStorage.getItem("fullName") || "Traveler";

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

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/matches" className="text-2xl font-bold text-sky-600">
            Tripzy
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/matches" className={linkClass("/matches")}>
              Matches
            </Link>

            <Link to="/messages" className={linkClass("/messages")}>
              Messages
            </Link>

            <Link to="/subscription" className={linkClass("/subscription")}>
              Subscription
            </Link>

            <Link to="/payments" className={linkClass("/payments")}>
              Payments
            </Link>

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

        <div className="flex items-center gap-4">
          <div className="hidden text-right md:block">
            <p className="text-sm text-slate-500">Logged in as</p>
            <p className="font-semibold text-slate-800">{fullName}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}