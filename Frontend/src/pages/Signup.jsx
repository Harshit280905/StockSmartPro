import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/Layout/PageLayout";
import { useToast } from "../hooks/useToast";
import { authApi } from "../services/api";
import { UserSchema } from "../schemas";

export default function Signup() {
  const { toast, showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { showToast("Please accept the Terms of Service.", true); return; }
    const { valid, errors, data } = UserSchema.validateRegister(form);
    if (!valid) { showToast(errors[0], true); return; }
    setSubmitting(true);
    try {
      await authApi.register(data);
      showToast("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      showToast(err.message || "Registration failed.", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout toast={toast}>
      <section className="auth-layout">
        <div className="glass-card auth-visual">
          <img src="/assets/inventory.png" alt="Inventory illustration" />
          <div className="overlay">
            <span className="eyebrow">🌟 Create your account</span>
            <h2 style={{ margin: "12px 0 8px" }}>
              Start managing inventory with a polished modern workflow.
            </h2>
            <p className="muted">
              A refined signup form creates a better first impression instantly.
            </p>
          </div>
        </div>

        <div className="glass-card auth-box">
          <h2>Sign Up</h2>
          <p>Fill in your details to create an account and access the dashboard.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input type="text" value={form.username} onChange={set("username")} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={set("email")} required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={form.password} onChange={set("password")} required />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" value={form.confirmPassword} onChange={set("confirmPassword")} required />
            </div>
            <label className="chip-option">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              {" "}I agree to the{" "}
              <Link to="/terms" style={{ color: "#a5bfff" }}>Terms of Service</Link>
            </label>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create Account"}
            </button>
            <div className="actions">
              <Link className="btn btn-secondary" to="/login">
                Already have an account?
              </Link>
            </div>
          </form>
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
