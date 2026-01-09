import { useEffect, useState } from "react";
import { api } from "./api";

export default function ItemsPage({ user, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(0);
  const [savingId, setSavingId] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  async function loadItems() {
    setError("");
    setLoading(true);
    try {
      const data = await api("/items");
      setItems(data.items);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function logout() {
    setError("");
    try {
      await api("/auth/logout", { method: "POST" });
      onLogout();
    } catch (e) {
      setError(e.message);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    setError("");
    try {
      await api("/items", {
        method: "POST",
        body: JSON.stringify({ name, quantity: Number(quantity) }),
      });
      setName("");
      setQuantity(0);
      await loadItems();
    } catch (e) {
      setError(e.message);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(item.quantity);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditQty(0);
  }

  async function saveEdit(id) {
    setError("");
    setSavingId(id);
    try {
      const data = await api(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editName,
          quantity: Number(editQty),
        }),
      });

      // Update local state without refetch
      setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));

      cancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id) {
    setError("");
    setDeletingId(id);
    try {
      await api(`/items/${id}`, { method: "DELETE" });

      // Remove from UI without refetch
      setItems((prev) => prev.filter((it) => it.id !== id));

      // If you were editing this item, exit edit mode
      if (editingId === id) cancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="card">
        <p>
          Logged in as <strong>{user.email}</strong>
        </p>
        <button onClick={logout}>Logout</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Add Item</h2>
        <form onSubmit={addItem}>
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Quantity
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </label>
          <button type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <h2>Items</h2>
        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
          <ul className="items">
            {items.map((it) => (
              <li key={it.id} className="item">
                {editingId === it.id ? (
                  <div className="item-edit">
                    <input
                      className="input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />

                    <input
                      className="input input--small"
                      type="number"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                    />

                    <div className="item-actions">
                      <button
                        className="button"
                        onClick={() => saveEdit(it.id)}
                        disabled={savingId === it.id}
                      >
                        {savingId === it.id ? "Saving…" : "Save"}
                      </button>

                      <button className="button button--secondary" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="item-view">
                    <div className="item-info">
                      <strong>{it.name}</strong>
                      <span className="item-qty">qty {it.quantity}</span>
                    </div>

                    <div className="item-actions">
                      <button
                        className="button button--link"
                        onClick={() => startEdit(it)}
                      >
                        Edit
                      </button>
                      <button
                        className="button button--danger"
                        onClick={() => deleteItem(it.id)}
                        disabled={deletingId === it.id}
                      >
                        {deletingId === it.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
