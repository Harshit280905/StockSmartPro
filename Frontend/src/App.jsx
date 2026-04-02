import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Terms from "./pages/Terms";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"               element={<Dashboard />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/signup"         element={<Signup />} />
          <Route path="/about"          element={<AboutUs />} />
          <Route path="/contact"        element={<Contact />} />
          <Route path="/feedback"       element={<Feedback />} />
          <Route path="/terms"          element={<Terms />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Legacy HTML paths redirect */}
          <Route path="/aboutUs.html"       element={<Navigate to="/about" replace />} />
          <Route path="/contactPage.html"   element={<Navigate to="/contact" replace />} />
          <Route path="/feedbackForm.html"  element={<Navigate to="/feedback" replace />} />
          <Route path="/loginPage.html"     element={<Navigate to="/login" replace />} />
          <Route path="/signupPage.html"    element={<Navigate to="/signup" replace />} />
          <Route path="/termsPage.html"     element={<Navigate to="/terms" replace />} />
          <Route path="/forgotPassPage.html" element={<Navigate to="/forgot-password" replace />} />
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
