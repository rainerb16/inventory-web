import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";
import ItemRow from "./components/ItemRow";
import ItemForm from "./components/ItemForm";


export default function ItemsPage({ user, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState(0);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [addError, setAddError] = useState("");
  const [editError, setEditError] = useState("");


  const navigate = useNavigate();

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
      navigate("/login");
    } catch (e) {
      setError(e.message);
    }
  }

  async function addItem(e) {
    e.preventDefault();
    setError("");
    setAddError("");

    const trimmed = String(name).trim();
    const qtyNum = Number(quantity);

    if (!trimmed) return setAddError("Name is required");
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      return setAddError("Quantity must be a 0 or more.");
    }

    setAdding(true);
    try {
      await api("/items", {
        method: "POST",
        body: JSON.stringify({ name: trimmed, quantity: qtyNum }),
      });

      setError("");
      setName("");
      setQuantity(0);

      // Option A: refetch (simple)
      await loadItems();

      // Option B (later): optimistic add
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
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
    setEditError("");

    const trimmed = String(editName).trim();
    const qtyNum = Number(editQty);

    if (!trimmed) return setEditError("Name is required");
    if (!Number.isInteger(qtyNum) || qtyNum <= 0) {
      return setEditError("Quantity must be a 0 or more.");
    }

    setSavingId(id);
    try {
      const data = await api(`/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: trimmed,
          quantity: qtyNum,
        }),
      });

      // Update local state without refetch
      setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));

      setEditError("");
      cancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingId(null);
    }
  }

  async function deleteItem(id) {
    if (!confirm("Delete this item?")) return;

    setError("");
    setDeletingId(id);

    try {
      await api(`/items/${id}`, { method: "DELETE" });

      setItems((prev) => prev.filter((it) => it.id !== id));

      if (editingId === id) cancelEdit();
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  const canAdd =
    String(name).trim().length > 0 && Number.isInteger(Number(quantity)) && Number(quantity) >= 0;

  const canSave =
    editingId !== null &&
    String(editName).trim().length > 0 &&
    Number.isInteger(Number(editQty)) &&
    Number(editQty) >= 0;


  return (
    <>
      <div className="card">
        <p>
          Logged in as <strong>{user.email}</strong>
        </p>
        <button className="button" onClick={logout}>Logout</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h2>Add Item</h2>
        <ItemForm
          name={name}
          quantity={quantity}
          onChangeName={setName}
          onChangeQty={setQuantity}
          onSubmit={addItem}
          disabled={adding}
          canSubmit={canAdd}
          buttonText={adding ? "Adding…" : "Add"}
        />

        {addError && <div className="error">{addError}</div>}
      </div>

      <div className="card">
        <h2>Items</h2>

        {editError && <div className="error">{editError}</div>}

        {loading ? (
          <p>Loading…</p>
        ) : items.length === 0 ? (
          <p>No items yet.</p>
        ) : (
            <ul className="items">
              {items.map((it) => (
                <ItemRow
                  key={it.id}
                  item={it}
                  isEditing={editingId === it.id}
                  editName={editName}
                  editQty={editQty}
                  onChangeName={setEditName}
                  onChangeQty={setEditQty}
                  onStartEdit={startEdit}
                  onCancelEdit={cancelEdit}
                  onSave={saveEdit}
                  onDelete={deleteItem}
                  isSaving={savingId === it.id}
                  isDeleting={deletingId === it.id}
                  canSave={canSave}
                />
              ))}
          </ul>
        )}
      </div>
    </>
  );
}
