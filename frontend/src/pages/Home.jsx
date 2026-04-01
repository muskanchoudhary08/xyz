import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <section className="grid grid-cols-2 items-center px-10 py-12">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-sky-600">
            Find your perfect travel companion
          </p>
          <h2 className="mb-5 text-5xl font-bold leading-tight text-slate-800">
            Connect. Explore. Travel Together.
          </h2>
          <p className="mb-8 max-w-xl text-lg text-slate-600">
            Tripzy helps solo travelers discover compatible travel partners
            based on destination, budget, travel style, and personality.
          </p>

          <div className="flex gap-4">
            <Link
              to="/signup"
              className="rounded-full bg-sky-500 px-6 py-3 font-semibold text-white hover:bg-sky-600"
            >
              Get Started
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=1400&auto=format&fit=crop"
            alt="Travel companions"
            className="h-[500px] w-full object-cover"
          />
        </div>
      </section>

      <section id="how-it-works" className="px-10 py-16">
        <h3 className="mb-10 text-center text-3xl font-bold text-slate-800">
          How It Works
        </h3>

        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="mb-3 text-xl font-semibold text-slate-800">Create Profile</h4>
            <p className="text-slate-600">
              Add your destination, budget, travel style, and interests.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="mb-3 text-xl font-semibold text-slate-800">Get Matched</h4>
            <p className="text-slate-600">
              Find travel companions with similar preferences and personalities.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h4 className="mb-3 text-xl font-semibold text-slate-800">Start Chatting</h4>
            <p className="text-slate-600">
              Message your matches and plan your next trip together.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}