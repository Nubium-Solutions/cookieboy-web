"use server";

import { redirect } from "next/navigation";
import { login, register } from "@/lib/auth";

export async function loginAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/app/dashboard");
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
