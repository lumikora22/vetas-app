"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: any) {
  const supabase = createClient();
  const data = {
    email: formData.username,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    throw new Error("Error al iniciar sesión");
  }

  return "/"; // Redirigir al dashboard o a la página principal
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error al cerrar sesión:", error);
    throw new Error("Error al cerrar sesión");
  }

  return "/login"; // Redirigir al login después de cerrar sesión
}

// Función para registrar un nuevo usuario
export async function register(formData: any) {
  const supabase = createClient();
  const data = {
    email: formData.username,
    password: formData.password,
  };

  console.log(data);

  // La respuesta de supabase.auth.signUp() puede contener solo error
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    throw new Error("Error al registrar el usuario");
  }

  return "/login"; // Redirigir a la página de login después de registrarse
}

export async function getUserRole(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId)
    .single();

  console.log(data);
  if (error) {
    console.error("Error obteniendo rol:", error);
    return null;
  }

  return data;
}

export async function getCurrentUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error obteniendo usuario:", error);
    return "null";
  }

  return user?.id || "null";
}
