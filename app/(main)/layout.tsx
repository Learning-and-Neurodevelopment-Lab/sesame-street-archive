import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { SignOutButton } from "@/components/SignOutButton";
import logo from '@/app/(main)/assets/sesame-street-archive-logo.png';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-sans">
        <header className="border-b bg-white shadow-sm sticky top-0 z-30 w-full">
          <nav className="w-full max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-800 hover:underline uppercase font-inter-tight">
              <Image src={logo} alt="Sesame Street Archive Logo" className="h-8" height={32} />
              Sesame Street Archive
            </Link>
            <div className="flex gap-2 items-center">
              <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                <Link href="/explore">Explore</Link>
              </Button>
              <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                <Link href="/about">About</Link>
              </Button>
              <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                <Link href="/guide">Guide</Link>
              </Button>
              <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                <Link href="/team">Team</Link>
              </Button>
              <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {session?.user ? (
                <Button asChild variant="ghost" className="text-base px-4 py-2 rounded-md hover:bg-neutral-100">
                  <Link href="/annotate">Annotate</Link>
                </Button>
              ) : null}
              {session?.user ? (
                <>
                  <span className="text-sm text-neutral-700">Hi, {session.user.name}</span>
                  <SignOutButton />
                </>
              ) : (
                <Button asChild variant="ghost">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t bg-white text-neutral-500 text-center py-4 text-xs">
          &copy; {new Date().getFullYear()} Sesame Street Archive.
        </footer>
      </body>
    </html>
  );
}