import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Sesame Street Archive</title>
        <meta name="description" content="A comprehensive archive of Sesame Street episodes and resources." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-inter flex flex-col w-full">
        {children}
      </body>
    </html>
  );
}