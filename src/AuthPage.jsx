import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

export default function AuthPage({ onAuthed }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onAuthed(data.user);
      navigate("/app");
    } catch (e) {
      setError(e.message);
    }
  }

  async function signup(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onAuthed(data.user);
      navigate("/app");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <h1>Inventory App</h1>
      {error && <div className="error">{error}</div>}

      <div className="auth">
        <div className="card">
          <form onSubmit={login}>
            <h2>Login</h2>
            <label>
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>

        <div className="card">
          <form onSubmit={signup}>
            <h2>Signup</h2>
            <label>
              Email
              <input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
            </label>
            <label>
              Password (8+ chars)
              <input type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
            </label>
            <button type="submit">Create account</button>
          </form>
        </div>
      </div>
    </>
  );
}
