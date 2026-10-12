"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

export function AdminSignOut() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Button
      className="bg-white text-navy-950 hover:bg-navy-100"
      disabled={isSigningOut}
      onClick={handleSignOut}
      type="button"
    >
      <LogOut aria-hidden="true" />
      {isSigningOut ? "Signing out…" : "Sign out"}
    </Button>
  );
}
