"use client";

import { useCallback, useEffect, useState } from "react";
import type { Transaction } from "./types";

const KEY = "catatuang:transactions:v1";

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function useTransactions() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as Transaction[]);
      }
    } catch {
      /* data rusak: mulai dari kosong */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* penyimpanan penuh / diblokir */
    }
  }, [items, ready]);

  const add = useCallback((t: Omit<Transaction, "id" | "createdAt">) => {
    setItems((prev) => [{ ...t, id: newId(), createdAt: Date.now() }, ...prev]);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { items, ready, add, remove };
}
