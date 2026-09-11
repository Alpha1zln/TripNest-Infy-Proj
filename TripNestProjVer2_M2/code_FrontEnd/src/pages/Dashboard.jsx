
// import { Link } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

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
          <Link to="/destinations" className="text-link">
            Explore destinations →
          </Link>
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

      {/* Group Admin / Group Management */}
      <section className="group-admin-card">
        <div>
          <span className="eyebrow">GROUP MANAGEMENT</span>
          <h2>Create a travel group</h2>
          <p>
            Create a group, invite travelers and coordinate your trip together.
            The group creator can act as the Group Admin.
          </p>
        </div>

        <button
        className="primary-btn"
        onClick={() => navigate("/group-member")}
      >
        + Create Group
      </button>


      </section>
    </div>
  );
}

export default Dashboard;




// wrkng ----------
// import { Link } from "react-router-dom";

// function Dashboard() {
//   return (
//     <div className="content-page dashboard-page">
//       <section className="dashboard-welcome">
//         <div>
//           <span className="eyebrow">TRIPNEST DASHBOARD</span>
//           <h1>Welcome back, Traveler.</h1>
//           <p>Your travel planning space is ready for the next adventure.</p>
//         </div>
//         <Link className="primary-btn" to="/destinations">Plan a trip</Link>
//       </section>

//       <div className="dashboard-grid">
//         <div className="dashboard-card large">
//           <span className="card-icon">✈</span>
//           <span className="card-label">UPCOMING TRIPS</span>
//           <strong>0</strong>
//           <p>No trips planned yet. Start with a destination.</p>
//           <Link to="/destinations" className="text-link">Explore destinations →</Link>
//         </div>
//         <div className="dashboard-card">
//           <span className="card-icon">🌍</span>
//           <span className="card-label">DESTINATIONS</span>
//           <strong>6</strong>
//           <p>Curated places to inspire your next journey.</p>
//         </div>
//         <div className="dashboard-card">
//           <span className="card-icon">🗺</span>
//           <span className="card-label">PLANNING</span>
//           <strong>Ready</strong>
//           <p>Build itineraries and organize your travel plans.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
