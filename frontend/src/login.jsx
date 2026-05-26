import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import { AuthContext } from "./auth-context-core";
import "./auth.css";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  function handleChange(e) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!user.username || !user.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        username: user.username,
        password: user.password,
      });
      
      login(response.data.user || { username: user.username }, response.data.token);
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">LunaraGPT</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Email Address</label>
            <input
              id="username"
              type="email"
              placeholder="your@email.com"
              name="username"
              value={user.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={user.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-link-section">
          <p className="auth-link-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
