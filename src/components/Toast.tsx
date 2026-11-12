import { useEffect } from "react";
import type { Notice } from "../types";

interface Props {
  notice: Notice | null;
  onDismiss: () => void;
}

export default function Toast({ notice, onDismiss }: Props) {
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  if (!notice) return null;

  return (
    <div className={`toast toast--${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>
      <span>{notice.text}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss message">
        ×
      </button>
    </div>
  );
}
