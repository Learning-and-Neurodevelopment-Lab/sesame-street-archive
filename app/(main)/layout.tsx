import Navigation from "@/components/Navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import Footer from "@/components/Footer";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <>
      <header className="border-b bg-white shadow-sm sticky top-0 z-30 w-full">
        <Navigation session={session} />
      </header>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}