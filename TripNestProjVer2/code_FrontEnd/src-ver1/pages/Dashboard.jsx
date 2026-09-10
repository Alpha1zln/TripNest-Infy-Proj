import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="content-page dashboard-page">
      <section className="dashboard-welcome">
        <div>
          <span className="eyebrow">TRIPNEST DASHBOARD</span>
          <h1>Welcome back, Traveler.</h1>
          <p>Your travel planning space is ready for the next adventure.</p>
        </div>
        <Link className="primary-btn" to="/destinations">Plan a trip</Link>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card large">
          <span className="card-icon">✈</span>
          <span className="card-label">UPCOMING TRIPS</span>
          <strong>0</strong>
          <p>No trips planned yet. Start with a destination.</p>
          <Link to="/destinations" className="text-link">Explore destinations →</Link>
        </div>
        <div className="dashboard-card">
          <span className="card-icon">🌍</span>
          <span className="card-label">DESTINATIONS</span>
          <strong>6</strong>
          <p>Curated places to inspire your next journey.</p>
        </div>
        <div className="dashboard-card">
          <span className="card-icon">🗺</span>
          <span className="card-label">PLANNING</span>
          <strong>Ready</strong>
          <p>Build itineraries and organize your travel plans.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
