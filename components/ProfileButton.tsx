"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { User, Camera, Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/store/useSession";
import { uploadAvatar, updateUserProfile } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export function ProfileButton() {
  const { user, refreshUser, logout } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);
  const [nombre, setNombre] = React.useState(user?.nombre || "");
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      setNombre(user.nombre || "");
    }
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen debe ser menor a 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: avatarUrl, error } = await uploadAvatar(user.id, file);
      if (error) {
        throw error;
      }
      await refreshUser();
      toast({
        title: "¡Éxito!",
        description: "Avatar actualizado correctamente",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "No se pudo subir el avatar. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await updateUserProfile(user.id, { nombre });
      if (error) {
        throw error;
      }
      await refreshUser();
      toast({
        title: "¡Éxito!",
        description: "Perfil actualizado correctamente",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const getInitials = () => {
    if (user.nombre) {
      return user.nombre
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 hover:scale-105 active:scale-95 transition-transform"
          >
            {user.avatar_url ? (
              <div className="relative h-6 w-6 rounded-full overflow-hidden">
                <Image
                  src={user.avatar_url}
                  alt={user.nombre || "Usuario"}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-kawaii-pink to-kawaii-rose flex items-center justify-center text-white font-semibold text-xs">
                {getInitials()}
              </div>
            )}
            <span>{user.nombre || "Usuario"}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setOpen(true)} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar Sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mi Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y avatar
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {user.avatar_url ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-kawaii-pink/30 cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  <Image
                    src={user.avatar_url}
                    alt={user.nombre || "Usuario"}
                    fill
                    className="object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24 rounded-full bg-gradient-to-br from-kawaii-pink to-kawaii-rose flex items-center justify-center text-white font-bold text-2xl cursor-pointer border-4 border-kawaii-pink/30"
                  onClick={handleAvatarClick}
                >
                  {getInitials()}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </motion.div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAvatarClick}
              disabled={uploading}
              className="gap-2"
            >
              <Camera className="h-4 w-4" />
              {uploading ? "Subiendo..." : "Cambiar Avatar"}
            </Button>
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full"
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="w-full bg-muted"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || nombre === (user.nombre || "")}
            className="bg-gradient-to-r from-kawaii-pink to-kawaii-rose hover:from-kawaii-rose hover:to-kawaii-pink"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </>
  );
}

