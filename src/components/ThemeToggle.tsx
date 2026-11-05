"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("catatuang:theme", next ? "dark" : "light");
    } catch {
      /* abaikan */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      className="btn-ghost h-10 min-w-10 px-2.5"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      {withLabel && <span>{dark ? "Mode terang" : "Mode gelap"}</span>}
    </button>
  );
}
