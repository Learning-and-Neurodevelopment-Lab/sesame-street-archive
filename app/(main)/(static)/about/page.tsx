import { notFound } from 'next/navigation';

export const metadata = {
  title: "About | Annotation Tool",
  description: "About the annotation tool project",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale = 'en' } = await params;

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