import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { formatRupiah, formatSigned } from "@/lib/format";

export default function SummaryCards({ income, expense }: { income: number; expense: number }) {
  const balance = income - expense;
  const positive = balance >= 0;

  return (
    <section aria-label="Ringkasan keuangan" className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
      <div
        className={`col-span-2 rounded-2xl border p-5 lg:col-span-1 ${
          positive ? "border-income/30 bg-income/10" : "border-expense/30 bg-expense/10"
        }`}
      >
        <div className="flex items-center gap-2 text-sm text-muted">
          <Wallet size={16} /> Total saldo
        </div>
        <p className={`mt-2 text-3xl font-bold tracking-tight ${positive ? "text-income" : "text-expense"}`}>
          {formatSigned(balance)}
        </p>
        <p className="mt-1 text-xs text-muted">{positive ? "Sisa uang Anda saat ini" : "Pengeluaran melebihi pemasukan"}</p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-4 lg:p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-income/15 text-income">
            <ArrowDownLeft size={14} />
          </span>
          Pemasukan
        </div>
        <p className="mt-2 truncate text-lg font-semibold text-income lg:text-2xl">{formatRupiah(income)}</p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-4 lg:p-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-expense/15 text-expense">
            <ArrowUpRight size={14} />
          </span>
          Pengeluaran
        </div>
        <p className="mt-2 truncate text-lg font-semibold text-expense lg:text-2xl">{formatRupiah(expense)}</p>
      </div>
    </section>
  );
}
