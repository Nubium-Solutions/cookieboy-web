import { cookies } from "next/headers";
import { vpsFetch } from "./api";

const COOKIE_NAME = "cb_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export type Customer = {
  id: number;
  email: string;
  full_name: string;
  company: string;
  country: string;
  stripe_customer_id?: string | null;
};

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function getCurrentCustomer(): Promise<{ customer: Customer; licenses: unknown[] } | null> {
  const token = await getSessionToken();
  if (!token) return null;
  try {
    return await vpsFetch("/api/customer/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const data = await vpsFetch("/api/customer/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  await setSessionCookie(data.token);
  return data.customer as Customer;
}

export async function register(payload: {
  email: string;
  password: string;
  full_name?: string;
  company?: string;
  country?: string;
}) {
  const data = await vpsFetch("/api/customer/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await setSessionCookie(data.token);
  return data.customer as Customer;
}

export async function logout() {
  const token = await getSessionToken();
  if (token) {
    try {
      await vpsFetch("/api/customer/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  await clearSessionCookie();
}
