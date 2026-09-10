function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <div className="footer-brand">✈️ TripNest</div>
          <p>Plan smarter. Travel better. Discover destinations, organize trips and create memorable journeys in one place.</p>
        </div>

        <div>
          <div className="footer-heading">Quick Links</div>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/destinations">Destinations</a>
            <a href="/login">Login</a>
            <a href="/register">Get Started</a>
          </div>
        </div>

        <div>
          <div className="footer-heading">TripNest</div>
          <div className="footer-contact">
            Travel planning & trip management platform<br />
            Explore • Plan • Organize • Travel<br />
            Built for a smarter travel experience.
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copy">© 2026 TripNest. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
