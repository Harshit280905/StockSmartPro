export default function Toast({ message, visible, isError }) {
  return (
    <div
      className="toast"
      style={{
        borderColor: isError ? "rgba(239,68,68,.35)" : "rgba(110,168,254,.2)",
      }}
      data-visible={visible}
    >
      {message}
    </div>
  );
}
