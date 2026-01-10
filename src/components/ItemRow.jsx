// src/components/ItemRow.jsx
export default function ItemRow({
  item,
  isEditing,
  editName,
  editQty,
  onChangeName,
  onChangeQty,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
  canSave = true,
}) {
  return (
    <li className="item">
      {isEditing ? (
        <div className="item-edit">
          <input
            className="input"
            value={editName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Item name"
            disabled={isSaving || !canSave}
          />

          <input
            className="input input--small"
            type="number"
            value={editQty}
            onChange={(e) => onChangeQty(e.target.value)}
            min="0"
            disabled={isSaving || !canSave}
          />

          <div className="item-actions">
            <button
              className="button"
              onClick={() => onSave(item.id)}
              disabled={isSaving || !canSave}

            >
              {isSaving ? "Saving…" : "Save"}
            </button>

            <button
              className="button button--secondary"
              onClick={onCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="item-view">
          <div className="item-info">
            <strong className="item-name">{item.name}</strong>
            <span className="item-qty">qty {item.quantity}</span>
          </div>

          <div className="item-actions">
            <button
              className="button button--link"
              onClick={() => onStartEdit(item)}
              disabled={isDeleting}
            >
              Edit
            </button>

            <button
              className="button button--danger"
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
