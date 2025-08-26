"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign Out
    </Button>
  );
}