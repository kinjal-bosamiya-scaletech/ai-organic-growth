/** "montu.khant@x.com" -> "Montu Khant". Falls back to the account's full name. */
export function displayName(fullName: string | undefined, email: string | undefined): string {
  const local = email?.split("@")[0] ?? "";
  const words = local.split(/[._\-+\d]+/).filter(Boolean);
  if (words.length > 1) return words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  const base = fullName || local;
  return base ? base[0].toUpperCase() + base.slice(1) : "";
}
