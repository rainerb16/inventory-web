import { useEffect, useState } from "react";
import { api } from "./api";

export default function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("you@test.com");
  const [password, setPassword] = useState("password123");

  const [error, setError] = useState("");

  async function loadMe() {
    const data = await api("/me");
    setUser(data.user);
  }

  useEffect(() => {
    (async () => {
      setError("");
      try {
        await loadMe();
      } catch {
        setUser(null);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  async function login(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(data.user);
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
      setUser(data.user);
    } catch (e) {
      setError(e.message);
    }
  }

  async function logout() {
    setError("");
    try {
      await api("/auth/logout", { method: "POST" });
      setUser(null);
    } catch (e) {
      setError(e.message);
    }
  }

  if (checking) {
    return (
      <div className="container">
        <p>Checking session…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Inventory App</h1>

      {error && <div className="error">{error}</div>}

      {!user ? (
        <div className="auth">
          <div className="card">
            <form onSubmit={login}>
              <h2>Login</h2>

              <label>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button type="submit">Login</button>
            </form>
          </div>

          <div className="card">
            <form onSubmit={signup}>
              <h2>Signup</h2>

              <label>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label>
                Password (8+ chars)
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>

              <button type="submit">Create account</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card">
          <p>
            Logged in as <strong>{user.email}</strong> (id: {user.id})
          </p>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
