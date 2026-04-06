import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function QuizPublic() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions] = useState([
    { id: 1, question_text: "What is your ideal vacation destination?", option_a: "Mountains", option_b: "Beaches", option_c: "Cities", option_d: "Countryside" },
    { id: 2, question_text: "What is your travel budget range?", option_a: "Under $500", option_b: "$500-$1000", option_c: "$1000-$2000", option_d: "$2000+" },
    { id: 3, question_text: "What type of accommodation do you prefer?", option_a: "Hostel", option_b: "Hotel", option_c: "Resort", option_d: "Airbnb" },
    { id: 4, question_text: "What is your travel style?", option_a: "Adventure", option_b: "Relaxation", option_c: "Cultural", option_d: "Party" },
    { id: 5, question_text: "How do you prefer to travel?", option_a: "Solo", option_b: "With friends", option_c: "With family", option_d: "With a tour group" },
    { id: 6, question_text: "What activities do you enjoy most?", option_a: "Hiking", option_b: "Swimming", option_c: "Shopping", option_d: "Sightseeing" },
    { id: 7, question_text: "How important is food in your travel experience?", option_a: "Not important", option_b: "Somewhat important", option_c: "Important", option_d: "Very important" },
    { id: 8, question_text: "What is your age range?", option_a: "18-25", option_b: "26-35", option_c: "36-50", option_d: "50+" },
    { id: 9, question_text: "How do you plan your trips?", option_a: "Spontaneous", option_b: "A little planning", option_c: "Detailed planning", option_d: "Use a travel agent" },
    { id: 10, question_text: "What do you value most in a travel companion?", option_a: "Same budget", option_b: "Same interests", option_c: "Same pace", option_d: "Same destination" }
  ]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id];

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [currentQuestion.id]: option });
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSignup(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const registerRes = await api.post("/auth/register", { fullName, email, password });
      console.log("User registered:", registerRes.data);

      const loginRes = await api.post("/auth/login", { email, password });
      const token = loginRes.data.access_token;
      const userId = loginRes.data.userId;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("fullName", fullName);

      const profileData = {
        preferredDestination: getDestinationFromQuiz(answers),
        budgetRange: getBudgetFromQuiz(answers),
        travelStyle: getTravelStyleFromQuiz(answers),
        interests: getInterestsFromQuiz(answers)
      };

      await api.post("/profile", profileData);

      navigate("/matches");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  function getDestinationFromQuiz(answers) {
    const destMap = { 'A': 'Mountains', 'B': 'Beaches', 'C': 'Cities', 'D': 'Countryside' };
    return destMap[answers[1]] || 'Mountains';
  }

  function getBudgetFromQuiz(answers) {
    const budgetMap = { 'A': 'Under $500', 'B': '$500-$1000', 'C': '$1000-$2000', 'D': '$2000+' };
    return budgetMap[answers[2]] || '$1000-$2000';
  }

  function getTravelStyleFromQuiz(answers) {
    const styleMap = { 'A': 'Adventure', 'B': 'Relaxation', 'C': 'Cultural', 'D': 'Party' };
    return styleMap[answers[4]] || 'Adventure';
  }

  function getInterestsFromQuiz(answers) {
    const interestsMap = { 'A': 'Hiking', 'B': 'Swimming', 'C': 'Shopping', 'D': 'Sightseeing' };
    return interestsMap[answers[6]] || 'Travel';
  }

  if (showSignup) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Create Your Account</h1>
          <p className="text-slate-500 mb-6">Complete your registration to see matches</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600 disabled:opacity-70"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <a href="/login" className="text-sky-500">Sign In</a>
          </p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <div className="text-center py-20">Loading quiz...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-slate-500 mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-sky-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((opt) => {
              const optionText = currentQuestion[`option_${opt}`];
              if (!optionText) return null;
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt.toUpperCase())}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    currentAnswer === opt.toUpperCase()
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 hover:border-sky-300"
                  }`}
                >
                  <span className="font-medium mr-3">{opt.toUpperCase()}.</span>
                  {optionText}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="px-6 py-2 rounded-xl border border-slate-300 disabled:opacity-50"
            >
              Previous
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}