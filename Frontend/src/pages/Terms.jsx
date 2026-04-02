import PageLayout from "../components/Layout/PageLayout";

const TERMS = [
  {
    title: "1. Use of Service",
    body: "StockSmart Pro is a demonstration-grade inventory management system. It is provided for educational, showcase, and portfolio purposes. Usage in production environments is at your own discretion.",
  },
  {
    title: "2. Data Storage",
    body: "All product and user data is stored locally in JSON files on the server. No data is transmitted to third parties. The demo system should not be used to store sensitive personal or financial information.",
  },
  {
    title: "3. User Accounts",
    body: "Passwords are currently stored in plain text for demonstration purposes. In a production system, all passwords must be securely hashed using bcrypt or equivalent.",
  },
  {
    title: "4. Intellectual Property",
    body: "The codebase, design system, and UI components are created for academic project submission. You are free to fork and build upon this project with attribution.",
  },
  {
    title: "5. Availability",
    body: "The demo server may be offline at any time. No uptime guarantee is provided.",
  },
  {
    title: "6. Modifications",
    body: "These terms may be updated at any time. Continued use of the system constitutes acceptance of any updated terms.",
  },
];

export default function Terms() {
  return (
    <PageLayout>
      <section className="page-hero" style={{ flexDirection: "column", maxWidth: 760, margin: "0 auto" }}>
        <div className="glass-card page-copy" style={{ maxWidth: "100%" }}>
          <span className="eyebrow">📄 Legal</span>
          <h2>Terms &amp; Conditions</h2>
          <p className="muted" style={{ marginBottom: 28 }}>
            Please read these terms before using StockSmart Pro. Last updated April 2026.
          </p>
          {TERMS.map(({ title, body }) => (
            <div key={title} style={{ marginBottom: 24 }}>
              <strong>{title}</strong>
              <p className="muted" style={{ marginTop: 6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
