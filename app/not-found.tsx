// app/(main)/(static)/research/[slug]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <html lang="en">
      <head>
        <title><em>Sesame Street</em>Archive</title>
        <meta
          name="description"
          content="A comprehensive archive of Sesame Street episodes and resources."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-inter flex flex-col w-full">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
