import { Provider } from "jotai";
import Toolbar from "@/components/Toolbar";
import { Button } from "@/components/ui/button";

export default function AnnotateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <html lang="en">
        <body className="bg-neutral-50 text-neutral-900 min-h-screen flex flex-col w-full">
          <div className="flex min-h-screen">
            <Toolbar />
            <div className="flex flex-col flex-1">
              {children}
            </div>
          </div>
        </body>
      </html>
    </Provider>
  );
}
