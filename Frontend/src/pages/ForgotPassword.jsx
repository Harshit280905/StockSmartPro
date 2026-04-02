import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/Layout/PageLayout";
import { useToast } from "../hooks/useToast";

export default function ForgotPassword() {
  const { toast, showToast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Enter a valid email address.", true);
      return;
    }
    setSent(true);
    showToast("Password reset instructions sent (demo).");
  };

  return (
    <PageLayout toast={toast}>
      <section className="auth-layout">
        <div className="glass-card auth-visual">
          <img src="/assets/forgotPasswordImage.png" alt="Reset password" />
          <div className="overlay">
            <span className="eyebrow">🔑 Reset access</span>
            <h2 style={{ margin: "12px 0 8px" }}>Regain access to your inventory dashboard.</h2>
            <p className="muted">
              Enter your registered email to receive password reset instructions.
            </p>
          </div>
        </div>

        <div className="glass-card auth-box">
          <h2>Forgot Password</h2>
          <p>Enter the email address associated with your account.</p>

          {sent ? (
            <div className="success-box" style={{ display: "block", marginTop: 16 }}>
              ✅ Check your inbox for reset instructions.
            </div>
          ) : (
            <form className="form-stack" onSubmit={handleSubmit}>
              <div className="field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit">
                Send Reset Link
              </button>
            </form>
          )}

          <div className="actions" style={{ marginTop: 16 }}>
            <Link className="btn btn-secondary" to="/login">Back to Login</Link>
            <Link className="btn btn-secondary" to="/signup">Create Account</Link>
          </div>
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
