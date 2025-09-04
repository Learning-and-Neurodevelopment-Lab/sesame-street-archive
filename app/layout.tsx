import "./global.css";
import { NextIntlClientProvider } from 'next-intl';
import ConfigureAmplifyClientSide from "@/components/ConfigureAmplifyClientSide";

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        <title>Sesame Street Archive</title>
        <meta name="description" content="A comprehensive archive of Sesame Street episodes and resources." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-neutral-50 text-neutral-900 min-h-screen font-inter flex flex-col w-full">
        <ConfigureAmplifyClientSide />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}