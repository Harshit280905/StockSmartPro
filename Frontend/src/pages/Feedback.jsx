import { useState } from "react";
import PageLayout from "../components/Layout/PageLayout";
import { useToast } from "../hooks/useToast";
import { feedbackApi } from "../services/api";
import { FeedbackSchema } from "../schemas";

const EMPTY = { name: "", email: "", "first-time": "", useful: "", reason: "" };

export default function Feedback() {
  const { toast, showToast } = useToast();
  const [form, setForm] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, errors, data } = FeedbackSchema.validate(form);
    if (!valid) { showToast(errors[0], true); return; }
    setSubmitting(true);
    try {
      await feedbackApi.submit(data);
      setSubmitted(true);
      showToast("Feedback submitted successfully!");
    } catch (err) {
      showToast(err.message || "Failed to submit feedback.", true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout toast={toast}>
      <section className="page-hero">
        <div className="glass-card page-copy">
          <span className="eyebrow">⭐ Feedback matters</span>
          <h2>Collect audience reactions in a clean, modern feedback workflow.</h2>
          <p>
            This section helps you show that the project is not only attractive but also designed
            with user feedback and improvement in mind.
          </p>
          <div className="small-list">
            <div className="small-list-item">
              <strong>Why this is impressive</strong>
              <br />
              <span className="muted">It shows product thinking, not just coding.</span>
            </div>
            <div className="small-list-item">
              <strong>Use it in your presentation</strong>
              <br />
              <span className="muted">Ask reviewers to share opinions live after they explore the dashboard.</span>
            </div>
          </div>
        </div>

        <div className="glass-card form-card">
          <h3 style={{ marginTop: 0 }}>Website Feedback Form</h3>

          {submitted ? (
            <div className="success-box" style={{ display: "block" }}>
              ✅ Thank you! Your feedback has been recorded.
            </div>
          ) : (
            <form className="form-stack" onSubmit={handleSubmit}>
              <div className="field">
                <label>Full Name</label>
                <input value={form.name} onChange={set("name")} required />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" value={form.email} onChange={set("email")} required />
              </div>
              <div className="field">
                <label>Is this your first visit?</label>
                <div className="option-row">
                  {["yes", "no"].map((v) => (
                    <label className="chip-option" key={v}>
                      <input
                        type="radio"
                        name="first-time"
                        value={v}
                        checked={form["first-time"] === v}
                        onChange={() => setForm((f) => ({ ...f, "first-time": v }))}
                      />{" "}
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Primary reason you visited</label>
                <textarea value={form.reason} onChange={set("reason")} />
              </div>
              <div className="field">
                <label>Was the website useful?</label>
                <div className="option-row">
                  {[["all", "Yes, all of it"], ["some", "Some of it"], ["none", "Not really"]].map(([v, label]) => (
                    <label className="chip-option" key={v}>
                      <input
                        type="radio"
                        name="useful"
                        value={v}
                        checked={form.useful === v}
                        onChange={() => setForm((f) => ({ ...f, useful: v }))}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
