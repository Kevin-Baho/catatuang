"use client";

import { RotateCcw, Search } from "lucide-react";
import { CATEGORIES, DEFAULT_FILTERS, type Filters } from "@/lib/types";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const TABS: { value: Filters["type"]; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "income", label: "Pemasukan" },
  { value: "expense", label: "Pengeluaran" },
];

export default function FilterBar({ filters, onChange }: Props) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const categories =
    filters.type === "all"
      ? Array.from(new Set([...CATEGORIES.income, ...CATEGORIES.expense]))
      : CATEGORIES[filters.type];
  const dirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-card p-3 lg:p-4">
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-bg p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={filters.type === t.value}
            onClick={() => set({ type: t.value, category: "" })}
            className={`rounded-lg py-2 text-xs font-semibold transition sm:text-sm ${
              filters.type === t.value ? "bg-card text-fg shadow-sm" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={filters.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Cari catatan atau kategori"
          className="field pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <label className="text-xs font-medium text-muted">
          Bulan
          <input
            type="month"
            value={filters.month}
            onChange={(e) => set({ month: e.target.value, from: "", to: "" })}
            className="field mt-1"
          />
        </label>
        <label className="text-xs font-medium text-muted">
          Kategori
          <select value={filters.category} onChange={(e) => set({ category: e.target.value })} className="field mt-1">
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-muted">
          Dari tanggal
          <input type="date" value={filters.from} onChange={(e) => set({ from: e.target.value, month: "" })} className="field mt-1" />
        </label>
        <label className="text-xs font-medium text-muted">
          Sampai tanggal
          <input type="date" value={filters.to} onChange={(e) => set({ to: e.target.value, month: "" })} className="field mt-1" />
        </label>
      </div>

      {dirty && (
        <button onClick={() => onChange(DEFAULT_FILTERS)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
          <RotateCcw size={13} /> Reset filter
        </button>
      )}
    </div>
  );
}
