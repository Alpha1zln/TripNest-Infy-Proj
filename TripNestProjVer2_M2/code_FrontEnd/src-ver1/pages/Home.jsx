import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">YOUR JOURNEY, SIMPLIFIED</span>
          <h1>Plan less.<br /><span>Travel more.</span></h1>
          <p>
            Discover inspiring destinations, organize your itinerary and
            keep every part of your trip in one place.
          </p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/destinations">Explore destinations</Link>
            <Link className="secondary-btn" to="/register">Start planning</Link>
          </div>
          <div className="hero-trust">
            <span>✓ Easy trip planning</span>
            <span>✓ Personalized experience</span>
            <span>✓ One place for your journey</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-card">
            <img src="/src/assets/hero.png" alt="Travel illustration" />
          </div>
          <div className="floating-card trip-float">
            <strong>Next adventure</strong>
            <span>Ready when you are ✈</span>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <div><span>01</span><strong>Discover</strong><p>Find places worth visiting.</p></div>
        <div><span>02</span><strong>Plan</strong><p>Build a day-wise itinerary.</p></div>
        <div><span>03</span><strong>Organize</strong><p>Keep your trip details together.</p></div>
      </section>
    </div>
  );
}

export default Home;
