"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { formatDigits, todayISO } from "@/lib/format";
import { CATEGORIES, type Transaction, type TxType } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (t: Omit<Transaction, "id" | "createdAt">) => void;
}

export default function TransactionForm({ open, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TxType>("expense");
  const [digits, setDigits] = useState("");
  const [date, setDate] = useState(todayISO());
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setType("expense");
    setDigits("");
    setDate(todayISO());
    setCategory(CATEGORIES.expense[0]);
    setNote("");
    setError("");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pickType = (t: TxType) => {
    setType(t);
    setCategory(CATEGORIES[t][0]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(digits);
    if (!amount || amount <= 0) return setError("Masukkan nominal lebih dari Rp 0.");
    if (!date) return setError("Pilih tanggal transaksi.");
    onSubmit({ type, amount, date, category, note: note.trim() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Tambah transaksi">
      <button aria-label="Tutup" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={submit}
        className="sheet relative max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-line bg-card p-5 pb-8 sm:max-w-md sm:rounded-3xl sm:pb-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Tambah transaksi</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-lg p-2 hover:bg-bg">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 rounded-xl bg-bg p-1" role="tablist">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={type === t}
              onClick={() => pickType(t)}
              className={`rounded-lg py-2.5 text-sm font-semibold transition ${
                type === t ? (t === "income" ? "bg-income text-white dark:text-bg" : "bg-expense text-white dark:text-bg") : "text-muted"
              }`}
            >
              {t === "income" ? "Pemasukan" : "Pengeluaran"}
            </button>
          ))}
        </div>

        <label className="mt-4 block text-sm font-medium">
          Nominal
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">Rp</span>
            <input
              inputMode="numeric"
              autoFocus
              placeholder="50.000"
              value={formatDigits(digits)}
              onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 13))}
              className="field pl-10 text-base font-semibold"
            />
          </div>
        </label>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">
            Tanggal
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field mt-1.5" />
          </label>
          <label className="block text-sm font-medium">
            {type === "income" ? "Sumber" : "Kategori"}
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="field mt-1.5">
              {CATEGORIES[type].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="mt-4 block text-sm font-medium">
          Catatan <span className="font-normal text-muted">(opsional)</span>
          <textarea
            rows={2}
            maxLength={200}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={type === "income" ? "Contoh: Gaji bulan November" : "Contoh: Makan siang di kantin"}
            className="field mt-1.5 resize-none"
          />
        </label>

        {error && <p className="mt-3 text-sm text-expense" role="alert">{error}</p>}

        <button type="submit" className="btn-primary mt-5 w-full py-3">Simpan transaksi</button>
      </form>
    </div>
  );
}
