import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import '@aws-amplify/ui-react/styles.css';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b bg-white shadow-sm sticky top-0 z-30 w-full">
        <Navigation />
      </header>
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </>
  );
}