import { useEffect, useState } from "react";
import AuthPage from "./AuthPage";
import ItemsPage from "./ItemsPage";
import { api } from "./api";

export default function App() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/me");
        setUser(data.user);
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) return <div className="container">Checking session…</div>;

  return (
    <div className="container">
      {!user ? (
        <AuthPage onAuthed={(u) => setUser(u)} />
      ) : (
        <ItemsPage user={user} onLogout={() => setUser(null)} />
      )}
    </div>
  );
}
