"use client";

import { Button } from "@/components/ui/button";

export function SignOutButton({ signOut }: { signOut?: () => void }) {
  async function handleSignOut() {
    signOut();
  }

  return (
    <Button variant="ghost" className="text-base px-4 py-2 font-bold cursor-pointer rounded-md hover:bg-neutral-100" onClick={handleSignOut}>
      <span className="font-medium">Sign Out</span>
    </Button>
  );
}