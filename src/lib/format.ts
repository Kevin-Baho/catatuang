const idr = new Intl.NumberFormat("id-ID");

export const formatRupiah = (n: number) => `Rp ${idr.format(Math.abs(n))}`;
export const formatSigned = (n: number) => `${n < 0 ? "-" : ""}Rp ${idr.format(Math.abs(n))}`;
export const formatDigits = (digits: string) => (digits ? idr.format(Number(digits)) : "");

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
