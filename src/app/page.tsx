"use client";

import { Plus, Wallet } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";
import FilterBar from "@/components/FilterBar";
import SummaryCards from "@/components/SummaryCards";
import ThemeToggle from "@/components/ThemeToggle";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import { formatDate, formatSigned } from "@/lib/format";
import { DEFAULT_FILTERS, type Filters } from "@/lib/types";
import { useTransactions } from "@/lib/useTransactions";

export default function Page() {
  const { items, ready, add, remove } = useTransactions();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const closeForm = useCallback(() => setFormOpen(false), []);
  const cancelDelete = useCallback(() => setDeleteId(null), []);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of items) t.type === "income" ? (income += t.amount) : (expense += t.amount);
    return { income, expense };
  }, [items]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return items
      .filter((t) => {
        if (filters.type !== "all" && t.type !== filters.type) return false;
        if (filters.category && t.category !== filters.category) return false;
        if (filters.month && !t.date.startsWith(filters.month)) return false;
        if (filters.from && t.date < filters.from) return false;
        if (filters.to && t.date > filters.to) return false;
        if (q && !`${t.note} ${t.category}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
  }, [items, filters]);

  const filteredNet = useMemo(
    () => filtered.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0),
    [filtered]
  );

  const toDelete = items.find((t) => t.id === deleteId);

  return (
    <div className="min-h-dvh lg:pl-64">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-card p-5 lg:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white dark:text-bg">
            <Wallet size={20} />
          </span>
          <div>
            <p className="font-bold leading-tight">CatatUang</p>
            <p className="text-xs text-muted">Keuangan pribadi</p>
          </div>
        </div>
        <button onClick={() => setFormOpen(true)} className="btn-primary mt-8 w-full py-3">
          <Plus size={18} /> Tambah transaksi
        </button>
        <div className="mt-auto space-y-3">
          <p className="text-xs leading-relaxed text-muted">Data tersimpan di browser ini saja. Menghapus data situs akan menghapus catatan Anda.</p>
          <ThemeToggle withLabel />
        </div>
      </aside>

      {/* Header mobile */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-white dark:text-bg">
            <Wallet size={18} />
          </span>
          <span className="font-bold">CatatUang</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-5xl space-y-5 px-4 pb-28 pt-5 lg:space-y-6 lg:px-8 lg:pb-10 lg:pt-8">
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold tracking-tight">Ringkasan keuangan</h1>
          <p className="mt-1 text-sm text-muted">{formatDate(new Date().toISOString().slice(0, 10))}</p>
        </div>

        <SummaryCards income={totals.income} expense={totals.expense} />

        <section className="space-y-3" aria-label="Riwayat transaksi">
          <h2 className="text-lg font-bold">Riwayat transaksi</h2>
          <FilterBar filters={filters} onChange={setFilters} />
          {ready ? (
            <>
              <p className="flex justify-between px-1 text-xs text-muted">
                <span>{filtered.length} transaksi</span>
                <span>Selisih: <b className={filteredNet >= 0 ? "text-income" : "text-expense"}>{formatSigned(filteredNet)}</b></span>
              </p>
              <TransactionList items={filtered} hasAny={items.length > 0} onDelete={setDeleteId} onAdd={() => setFormOpen(true)} />
            </>
          ) : (
            <div className="h-40 animate-pulse rounded-2xl bg-card" />
          )}
        </section>
      </main>

      {/* FAB mobile */}
      <button
        onClick={() => setFormOpen(true)}
        aria-label="Tambah transaksi"
        className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 active:scale-95 dark:text-bg lg:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus size={26} />
      </button>

      <TransactionForm open={formOpen} onClose={closeForm} onSubmit={add} />
      <ConfirmDialog
        open={!!toDelete}
        title="Hapus transaksi?"
        message={toDelete ? `Transaksi ${toDelete.category} (${formatDate(toDelete.date)}) akan dihapus permanen.` : ""}
        confirmLabel="Hapus"
        onCancel={cancelDelete}
        onConfirm={() => {
          if (deleteId) remove(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
