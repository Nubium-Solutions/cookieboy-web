"use server";

import { redirect } from "next/navigation";
import { login, register } from "@/lib/auth";

function safeNext(raw: string): string {
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/app/dashboard";
  return raw;
}

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? "/app/dashboard"));
  try {
    await login(email, password);
  } catch (e) {
    return { error: (e as Error).message };
  }
  redirect(next);
}

export async function registerAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const full_name = String(formData.get("full_name") ?? "");
  const company = String(formData.get("company") ?? "");
  try {
    await register({ email, password, full_name, company });
  } catch (e) {
    return { error: (e as Error).message };
  }
  redirect("/app/dashboard");
}
