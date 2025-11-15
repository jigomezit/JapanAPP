"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/store/useSession";
import { AnimatedButton } from "@/components/AnimatedButton";
import { SuccessCelebration } from "@/components/SuccessCelebration";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [requiresEmailConfirmation, setRequiresEmailConfirmation] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setShowCelebration(false);
    setIsSuccess(false);
    setRequiresEmailConfirmation(false);

    const result = await register(email, password, nombre);

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
    } else {
      // Guardar si requiere confirmación de email
      setRequiresEmailConfirmation(result.requiresEmailConfirmation || false);
      // Mostrar celebración
      setIsSuccess(true);
      setShowCelebration(true);
      setIsLoading(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
    // Redirigir según si requiere confirmación de email o no
    setTimeout(() => {
      if (requiresEmailConfirmation) {
        // Si requiere confirmación, redirigir a login con mensaje
        router.push("/auth/login?registered=true");
      } else {
        // Si no requiere confirmación, redirigir a dashboard
        router.push("/dashboard");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-pink/20 via-kawaii-lavender/20 to-kawaii-blue/20 p-4">
      <SuccessCelebration
        show={showCelebration}
        onComplete={handleCelebrationComplete}
        message="¡Cuenta creada exitosamente!"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isSuccess ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 0.3,
          scale: {
            duration: 0.5,
            times: [0, 0.5, 1],
          },
        }}
        className="w-full max-w-md"
      >
        <motion.div
          animate={{
            filter: isSuccess ? "brightness(1.1)" : "brightness(1)",
          }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl border-2">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-kawaii-pink to-kawaii-rose bg-clip-text text-transparent">
              Crear Cuenta
            </CardTitle>
            <CardDescription>
              Únete para comenzar a practicar japonés
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm"
                >
                  {error}
                </motion.div>
              )}
              <AnimatedButton
                type="submit"
                variant="kawaii"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </AnimatedButton>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/login"
                className="text-primary hover:underline font-semibold"
              >
                Inicia sesión
              </Link>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

