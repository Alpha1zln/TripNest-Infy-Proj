import { loginUser } from "../services/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (email === "") {
      setError("Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">✈️</div>
        <span className="eyebrow">WELCOME BACK</span>
        <h1>Sign in to TripNest</h1>
        <p className="auth-subtitle">Continue planning your next adventure.</p>

        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email address
            <input type="email" placeholder="you@example.com" value={email}
              onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label>Password
            <input type="password" placeholder="Enter your password" value={password}
              onChange={(event) => setPassword(event.target.value)} />
          </label>
          {/* //<button className="primary-btn full-btn" type="submit">Sign in</button> */}
          {/* <button className="primary-btn full-btn" type="submit">
            Sign in
          </button>

          <div className="oauth-divider">
            <span>Or</span>
          </div>
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="google-btn"
          >
            <span> G </span>
            Continue with Google
          </a> */}
              <button className="primary-btn full-btn" type="submit">
                  Sign in
                </button>

                <div className="auth-divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  className="google-btn"
                  onClick={() => {
                    window.location.href =
                      "http://localhost:8080/oauth2/authorization/google";
                  }}
                >
                  <span>G</span>
                  Continue with Google
                </button>

        </form>

        <div className="auth-divider"><span>Secure account access</span></div>
        <p className="auth-switch">New to TripNest? <Link to="/register">Create an account</Link></p>
      </div>
      <div className="auth-side">
        <span>✦</span>
        <h2>Your next journey starts here.</h2>
        <p>Discover destinations and turn travel ideas into organized trips.</p>
      </div>
    </div>
  );
}

export default Login;
