// src/components/ItemForm.jsx
export default function ItemForm({
  name,
  quantity,
  onChangeName,
  onChangeQty,
  onSubmit,
  disabled = false,
  buttonText = "Add",
  canSubmit = true,
}) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label className="label">
        Name
        <input
          className="input"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="e.g. Headphones"
          disabled={disabled}
        />
      </label>

      <label className="label">
        Quantity
        <input
          className="input input--small"
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => onChangeQty(e.target.value)}
          disabled={disabled}
        />
      </label>

      <button className="button" type="submit" disabled={disabled || !canSubmit}>
        {buttonText}
      </button>
    </form>
  );
}
