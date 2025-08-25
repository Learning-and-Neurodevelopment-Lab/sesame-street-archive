import Link from "next/link";

export const metadata = {
  title: "Team | Annotation Tool",
  description:"Meet the dedicated team behind the Sesame Street Archive.",
};

export default function TeamPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Meet the Team</h1>
        <p className="text-lg text-neutral-600">
          We are a group of passionate individuals dedicated to preserving the legacy of Sesame Street through research and technology.
        </p>
      </header>
    </div>
  );
}