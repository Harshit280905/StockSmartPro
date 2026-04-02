import PageLayout from "../components/Layout/PageLayout";

const TEAM = [
  { name: "Aman Kumar", role: "Frontend experience and project presentation" },
  { name: "Sujal Garg", role: "Database management and system design" },
  { name: "Harshit Batra", role: "Backend logic and technical structure" },
  { name: "Shreya", role: "Design support and UI/UX" },
  { name: "Ojasv Jindal", role: "Testing and documentation" },
];

const HIGHLIGHTS = [
  { title: "Elegant UI", desc: "Premium gradients, clean cards, better spacing, and smoother hierarchy." },
  { title: "Useful Workflow", desc: "Add products, record sales, search inventory, and monitor risks in one place." },
  { title: "Better Impression", desc: "Designed to look polished for demos, viva, interviews, or project review." },
];

export default function AboutUs() {
  return (
    <PageLayout>
      <section className="page-hero">
        <div className="glass-card page-copy">
          <span className="eyebrow">👋 About the project</span>
          <h2>Inventory management made cleaner, smarter, and more presentation-ready.</h2>
          <p>
            StockSmart Pro is a modern inventory system concept built to help businesses organize
            stock, track outgoing sales, monitor low stock items, and present data in a way that
            feels premium and professional.
          </p>

          <div className="info-grid">
            {HIGHLIGHTS.map(({ title, desc }) => (
              <div className="glass-card info-card" key={title}>
                <strong>{title}</strong>
                <p className="muted">{desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card form-card">
            <h3 style={{ marginTop: 0 }}>Core Team</h3>
            <div className="small-list">
              {TEAM.map(({ name, role }) => (
                <div className="small-list-item" key={name}>
                  <strong>{name}</strong>
                  <br />
                  <span className="muted">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <img src="/assets/team.png" alt="Team" style={{ width: "100%", borderRadius: 16 }} />
        </div>
      </section>
      <p className="footer-note">Crafted to look stronger, smoother, and more demo-ready.</p>
    </PageLayout>
  );
}
