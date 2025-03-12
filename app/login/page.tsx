// app/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { login, register } from "./actions";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Controlador para el registro
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        // Si estamos en el formulario de registro
        await register({ username: email, password });
      } else {
        // Si estamos en el formulario de login
        await login({ username: email, password });
      }
      router.push("/dashboard"); // Redirigir al dashboard después de iniciar sesión o registrarse
    } catch (error: any) {
      setError(error.message); // Mostrar el error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <h1>{isRegistering ? "Registrar Cuenta" : "Iniciar Sesión"}</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                placeholder="Usuario"
                type="text"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <Input
                placeholder="Contraseña"
                type="password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
                required
                className="w-full"
              />
              {error && <h2 className="text-red-500">{error}</h2>}
              <Button type="submit" className="w-full mt-4">
                {isRegistering ? "Registrarse" : "Iniciar Sesión"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
