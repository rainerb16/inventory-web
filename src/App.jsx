import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./api";
import AuthPage from "./AuthPage";
import ItemsPage from "./ItemsPage";

function ProtectedRoute({ user, loading, children }) {
  if (loading) return <p>Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ user, loading, children }) {
  if (loading) return <p>Loading…</p>;
  if (user) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  async function loadMe() {
    setLoadingMe(true);
    try {
      const data = await api("/me");
      setUser(data.user); // {id, email} or null
    } catch {
      setUser(null);
    } finally {
      setLoadingMe(false);
    }
  }

  useEffect(() => {
    loadMe();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute user={user} loading={loadingMe}>
                <AuthPage onAuthed={(u) => setUser(u)} />
              </PublicRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute user={user} loading={loadingMe}>
                <ItemsPage
                  user={user}
                  onLogout={() => setUser(null)}
                />
              </ProtectedRoute>
            }
          />

          {/* Default route */}
          <Route
            path="*"
            element={<Navigate to={user ? "/app" : "/login"} replace />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
