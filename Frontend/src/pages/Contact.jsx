import { useState } from "react";
import PageLayout from "../components/Layout/PageLayout";
import { useToast } from "../hooks/useToast";

const CONTACT_INFO = [
  { label: "Email", value: "stocksmartpro.demo@gmail.com" },
  { label: "Phone", value: "+91 98765 43210" },
  { label: "Location", value: "India · Available for student demos and presentations" },
];

export default function Contact() {
  const { toast, showToast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Message drafted for demo presentation.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <PageLayout toast={toast}>
      <section className="page-hero">
        <div className="glass-card page-copy">
          <span className="eyebrow">📩 Let's connect</span>
          <h2>Contact the StockSmart Pro team.</h2>
          <p>
            Use the project as a live demo and collect questions, suggestions, or collaboration
            requests from reviewers, mentors, or potential clients.
          </p>
          <div className="small-list">
            {CONTACT_INFO.map(({ label, value }) => (
              <div className="small-list-item" key={label}>
                <strong>{label}</strong>
                <br />
                <span className="muted">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card form-card">
          <h3 style={{ marginTop: 0 }}>Send a quick message</h3>
          <form className="form-stack" onSubmit={handleSubmit}>
            <div className="field">
              <label>Name</label>
              <input placeholder="Your name" value={form.name} onChange={set("name")} />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="Your email" value={form.email} onChange={set("email")} />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea
                placeholder="Tell us what you liked or what you want us to improve."
                value={form.message}
                onChange={set("message")}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </form>
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
