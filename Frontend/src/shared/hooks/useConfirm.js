import { useState, useCallback } from "react";

export function useConfirm() {
  const [state, setState] = useState({
    show:         false,
    title:        "",
    message:      "",
    confirmText:  "Confirmar",
    cancelText:   "Cancelar",
    confirmStyle: { borderColor: "#ef4444", color: "#ef4444" },
    onConfirm:    null,
  });

  const confirm = useCallback(({ title, message, confirmText, cancelText, confirmStyle, onConfirm }) => {
    setState({
      show: true,
      title:        title        ?? "¿Estás seguro?",
      message:      message      ?? "",
      confirmText:  confirmText  ?? "Confirmar",
      cancelText:   cancelText   ?? "Cancelar",
      confirmStyle: confirmStyle ?? { borderColor: "#ef4444", color: "#ef4444" },
      onConfirm,
    });
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, show: false, onConfirm: null }));
  }, []);

  return { confirmState: state, confirm, closeConfirm: close };
}