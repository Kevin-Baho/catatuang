import { ArrowDownLeft, ArrowUpRight, Inbox, Trash2 } from "lucide-react";
import { formatDate, formatRupiah } from "@/lib/format";
import type { Transaction } from "@/lib/types";

interface Props {
  items: Transaction[];
  hasAny: boolean;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function TransactionList({ items, hasAny, onDelete, onAdd }: Props) {
  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-2xl border border-dashed border-line px-6 py-14 text-center">
        <Inbox size={32} className="text-muted" />
        <p className="mt-3 font-semibold">{hasAny ? "Tidak ada transaksi yang cocok" : "Belum ada transaksi"}</p>
        <p className="mt-1 max-w-xs text-sm text-muted">
          {hasAny ? "Ubah atau reset filter untuk melihat transaksi lain." : "Catat pemasukan atau pengeluaran pertama Anda."}
        </p>
        {!hasAny && (
          <button onClick={onAdd} className="btn-primary mt-4">Tambah transaksi</button>
        )}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
      {items.map((t) => {
        const income = t.type === "income";
        return (
          <li key={t.id} className="flex items-center gap-3 p-3.5 lg:px-5">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${income ? "bg-income/15 text-income" : "bg-expense/15 text-expense"}`}>
              {income ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="rounded-full bg-bg px-2.5 py-0.5 text-xs font-semibold">{t.category}</span>
                <span className="text-xs text-muted">{formatDate(t.date)}</span>
              </div>
              {t.note && <p className="mt-1 truncate text-sm text-muted">{t.note}</p>}
            </div>
            <p className={`shrink-0 text-sm font-bold sm:text-base ${income ? "text-income" : "text-expense"}`}>
              {income ? "+" : "-"}{formatRupiah(t.amount)}
            </p>
            <button
              onClick={() => onDelete(t.id)}
              aria-label={`Hapus transaksi ${t.category}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-expense/10 hover:text-expense"
            >
              <Trash2 size={17} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
