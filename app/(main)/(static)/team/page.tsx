import { notFound } from "next/navigation";

export const metadata = {
  title: "Team | Annotation Tool",
  description:"Meet the dedicated team behind the Sesame Street Archive.",
};

export default async function TeamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale = 'en' } = await params;

    try {
    const Content = (await import(`@/markdown/team/${locale}.mdx`)).default;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Content />
      </div>
    );
  } catch (error) {
    notFound();
  }
}