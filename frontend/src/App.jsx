import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import QuizPublic from "./pages/QuizPublic";
import ProfileSetup from "./pages/ProfileSetup";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";
import Subscription from "./pages/Subscription";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - No login needed */}
        <Route path="/" element={<QuizPublic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES - Login required */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}