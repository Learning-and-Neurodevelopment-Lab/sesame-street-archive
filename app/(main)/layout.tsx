import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-sans">
        <header className="border-b bg-white shadow-sm sticky top-0 z-30 w-full">
          <Navigation session={session} />
        </header>
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t bg-white text-neutral-500 text-center py-4 text-xs">
          &copy; {new Date().getFullYear()} Sesame Street Archive.
        </footer>
      </body>
    </html>
  );
}