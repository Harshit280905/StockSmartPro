import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/Layout/PageLayout";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { UserSchema } from "../schemas";

export default function Login() {
  const { toast, showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors, data } = UserSchema.validateLogin(form);
    if (!valid) { showToast(errors[0], true); return; }
    setSubmitting(true);
    try {
      const res = await authApi.login(data);
      login(res.username || data.username);
      navigate("/");
    } catch (err) {
      showToast(err.message || "Invalid credentials.", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout toast={toast}>
      <section className="auth-layout">
        <div className="glass-card auth-visual">
          <img src="/assets/warehouse.jpg" alt="Warehouse" />
          <div className="overlay">
            <span className="eyebrow">🚀 Faster access</span>
            <h2 style={{ margin: "12px 0 8px" }}>
              Welcome back to your premium inventory dashboard.
            </h2>
            <p className="muted">
              Monitor stock health, sales activity, and product value in a single experience.
            </p>
          </div>
        </div>

        <div className="glass-card auth-box">
          <h2>Login</h2>
          <p>Sign in to explore the upgraded StockSmart Pro inventory experience.</p>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={set("username")}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={set("password")}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Logging in…" : "Login"}
            </button>
            <div className="actions">
              <Link className="btn btn-secondary" to="/forgot-password">
                Forgot password?
              </Link>
              <Link className="btn btn-secondary" to="/signup">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
