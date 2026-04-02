import { useState, useCallback, useRef } from "react";

export function useToast() {
  const [toast, setToast] = useState({ message: "", visible: false, isError: false });
  const timerRef = useRef(null);

  const showToast = useCallback((message, isError = false) => {
    clearTimeout(timerRef.current);
    setToast({ message, visible: true, isError });
    timerRef.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2600);
  }, []);

  return { toast, showToast };
}
