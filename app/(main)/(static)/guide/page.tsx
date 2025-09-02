import { notFound } from "next/navigation";

export const metadata = {
  title: "Guide | Annotation Tool",
  description: "How to use the annotation tool effectively",
};

export default async function GuidePage({ params }: { params: { [key: string]: string } }) {
  const { locale = "en" } = params;

  try {
    const Content = (await import(`./${locale}.mdx`)).default;

    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="sticky top-20">
            <h3 className="font-semibold text-neutral-800 mb-4">Contents</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#introduction"
                  className="block text-neutral-600 hover:text-blue-600 py-1"
                >
                  Introduction
                </a>
              </li>
              <li>
                <a
                  href="#search"
                  className="block text-neutral-600 hover:text-blue-600 py-1"
                >
                  Searching the Archive
                </a>
              </li>
              <li>
                <a
                  href="#browsing"
                  className="block text-neutral-600 hover:text-blue-600 py-1"
                >
                  Browsing by Category
                </a>
              </li>
              <li>
                <a
                  href="#annotations"
                  className="block text-neutral-600 hover:text-blue-600 py-1"
                >
                  Annotations & Contributions
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="block text-neutral-600 hover:text-blue-600 py-1"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-3xl">
          <Content />
        </div>
      </div>
    );
  } catch (error) {
    console.log("ERROR", error);
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Left Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="sticky top-20">
          <h3 className="font-semibold text-neutral-800 mb-4">Contents</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="#introduction"
                className="block text-neutral-600 hover:text-blue-600 py-1"
              >
                Introduction
              </a>
            </li>
            <li>
              <a
                href="#search"
                className="block text-neutral-600 hover:text-blue-600 py-1"
              >
                Searching the Archive
              </a>
            </li>
            <li>
              <a
                href="#browsing"
                className="block text-neutral-600 hover:text-blue-600 py-1"
              >
                Browsing by Category
              </a>
            </li>
            <li>
              <a
                href="#annotations"
                className="block text-neutral-600 hover:text-blue-600 py-1"
              >
                Annotations & Contributions
              </a>
            </li>
            <li>
              <a
                href="#faq"
                className="block text-neutral-600 hover:text-blue-600 py-1"
              >
                FAQ
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            <em>Sesame Street</em> Archive Guide
          </h1>
          <p className="text-lg text-neutral-600">
            Learn how to use the Sesame Street Archive with this step-by-step
            guide. Explore features, search tips, and annotation best practices.
          </p>
        </header>

        <section id="introduction" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
          <p className="text-neutral-700">
            The Sesame Street Archive is a comprehensive resource for fans,
            researchers, and educators. It provides access to episodes,
            segments, cast information, and more. This guide will help you get
            the most out of the archive's features.
          </p>
        </section>

        <section id="search" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-2">Searching the Archive</h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700">
            <li>
              <strong>Use the Explore Feature:</strong> Enter keywords such as
              episode titles, character names, or topics.
            </li>
            <li>
              <strong>Advanced Filters:</strong> Refine your search using the
              filter panel.
            </li>
            <li>
              <strong>Segment Search:</strong> Find relevant terms.
            </li>
          </ol>
        </section>

        <section id="browsing" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-2">Browsing by Category</h2>
          <ul className="list-disc list-inside space-y-2 text-neutral-700">
            <li>
              <strong>Faces:</strong> Browse annotations.
            </li>
            <li>
              <strong>Places:</strong> Explore segments.
            </li>
            <li>
              <strong>Numbers:</strong> Find episodes and segments focused on
              specific numbers or counting themes.
            </li>
          </ul>
        </section>

        <section id="annotations" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-2">
            Annotations & Contributions
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-neutral-700">
            <li>
              <strong>View Annotations:</strong> See community notes and trivia
              on episodes and segments.
            </li>
            <li>
              <strong>Add Your Own:</strong> Contribute facts, corrections, or
              memories by clicking the "Add Annotation" button.
            </li>
            <li>
              <strong>Moderation:</strong> All contributions are reviewed for
              accuracy and appropriateness.
            </li>
          </ol>
        </section>

        <section id="faq" className="mb-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-2">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-neutral-700">
            <div>
              <strong>Is the archive official?</strong>
              <p>
                No, this is a research focused resource and is not affiliated
                with Sesame Workshop.
              </p>
            </div>
            <div>
              <strong>Can I watch full episodes?</strong>
              <p>
                Some episodes and segments are available on streaming platforms;
                others may have summaries or screenshots.
              </p>
            </div>
            <div>
              <strong>How can I contribute?</strong>
              <p>
                Register for a free account and use the annotation tools to add
                or edit information.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
