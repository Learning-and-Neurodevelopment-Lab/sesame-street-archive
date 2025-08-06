import Link from "next/link";

export const metadata = {
  title: "About | Annotation Tool",
  description: "About the annotation tool project",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">About the Sesame Street Archive</h1>
        <p className="text-lg text-neutral-600">
          The Sesame Street Archive is a fan-created resource dedicated to cataloging and preserving the history of Sesame Street. This project is not affiliated with Sesame Workshop, but is built by fans for fans, researchers, and educators.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Mission</h2>
        <p className="text-neutral-700">
          Our mission is to provide a comprehensive, searchable, and accessible database of Sesame Street episodes, segments, cast, and production details. We aim to support nostalgia, research, and the celebration of Sesame Street’s cultural impact.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">What You'll Find</h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-700">
          <li>
            <strong>Episode Guides:</strong> Detailed information on every episode, including air dates, synopses, and featured segments.
          </li>
          <li>
            <strong>Segment Database:</strong> A catalog of skits, songs, animations, and recurring features.
          </li>
          <li>
            <strong>Cast & Characters:</strong> Profiles of human cast members, Muppets, and guest stars.
          </li>
          <li>
            <strong>Production Credits:</strong> Behind-the-scenes details about writers, puppeteers, and crew.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">How You Can Help</h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-700">
          <li>
            <strong>Contribute Information:</strong> Submit missing details, corrections, or trivia.
          </li>
          <li>
            <strong>Share Memories:</strong> Add your own stories or recollections about Sesame Street.
          </li>
          <li>
            <strong>Spread the Word:</strong> Let others know about this resource!
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-2">Disclaimer</h2>
        <p className="text-neutral-700">
          This site is not affiliated with Sesame Workshop or any official Sesame Street entity. All trademarks and copyrights are the property of their respective owners. This archive is for educational and research purposes only.
        </p>
      </section>
    </div>
  );
}