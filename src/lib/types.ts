export type TxType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  date: string; // YYYY-MM-DD
  category: string;
  note: string;
  createdAt: number;
}

export const CATEGORIES: Record<TxType, string[]> = {
  income: ["Gaji", "Bonus", "Freelance", "Investasi", "Lainnya"],
  expense: ["Makanan", "Transportasi", "Belanja", "Tagihan", "Hiburan", "Lainnya"],
};

export interface Filters {
  type: "all" | TxType;
  category: string; // "" = semua
  month: string; // "" atau YYYY-MM
  from: string;
  to: string;
  q: string;
}

export const DEFAULT_FILTERS: Filters = { type: "all", category: "", month: "", from: "", to: "", q: "" };
