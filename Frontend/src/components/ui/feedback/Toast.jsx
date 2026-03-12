import { useEffect } from "react";

export default function Toast({ show, message, type = "success", onClose }) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        minWidth: "250px",
        padding: "12px 16px",
        borderRadius: "8px",
        color: "white",
        backgroundColor:
          type === "success" ? "#28a745" : "#dc3545",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      {message}
    </div>
  );
}
