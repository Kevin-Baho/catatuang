"use client";

import { useEffect } from "react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="alertdialog" aria-modal="true" aria-label={title}>
      <button aria-label="Batal" className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="sheet relative w-full max-w-sm rounded-2xl border border-line bg-card p-5">
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1.5 text-sm text-muted">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onCancel} className="btn-ghost">Batal</button>
          <button onClick={onConfirm} className="inline-flex items-center justify-center rounded-xl bg-expense px-4 py-2.5 text-sm font-semibold text-white dark:text-bg">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
