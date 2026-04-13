export const VPS_API = process.env.NEXT_PUBLIC_VPS_API ?? "https://licencias.nubiumsolutions.com";

export async function vpsFetch(path: string, init: RequestInit = {}) {
  const res = await fetch(`${VPS_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error ?? `http_${res.status}`);
    throw err;
  }
  return data;
}
