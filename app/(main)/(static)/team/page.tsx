import { notFound } from "next/navigation";

export const metadata = {
  title: "Team | Annotation Tool",
  description:"Meet the dedicated team behind the Sesame Street Archive.",
};

export default async function TeamPage({
  params,
}: {
  params: Record<string, string | string[]>;
}) {
  const { locale = 'en' } = params;

    try {
    const Content = (await import(`./${locale}.mdx`)).default;

    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Content />
      </div>
    );
  } catch (error) {
    console.log('ERROR', error);
    notFound();
  }
}