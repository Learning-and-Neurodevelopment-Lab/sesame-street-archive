"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Mock search data - replace with your actual data source
const searchData = [
  { id: 1, title: "Big Bird Face Detection - Episode 4550", type: "face", url: "/faces/big-bird" },
  { id: 2, title: "Elmo Close-up Analysis", type: "face", url: "/faces/elmo" },
  { id: 3, title: "Sesame Street Set - Main Street", type: "place", url: "/places/main-street" },
  { id: 4, title: "Cookie Monster's Kitchen", type: "place", url: "/places/kitchen" },
  { id: 5, title: "Number 8 Segment Analysis", type: "number", url: "/numbers/8" },
  { id: 6, title: "Counting to 10 with The Count", type: "number", url: "/numbers/10" },
  { id: 7, title: "Oscar's Trash Can Location", type: "place", url: "/places/trash-can" },
  { id: 8, title: "Bert and Ernie Facial Recognition", type: "face", url: "/faces/bert-ernie" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "face": return "bg-blue-100 text-blue-800";
    case "place": return "bg-green-100 text-green-800";
    case "number": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof searchData>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filteredResults = searchData.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
        setIsSearching(false);
        setShowResults(true);
      }, 200);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setShowResults(false);
      setIsSearching(false);
    }
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore the Archive</h1>
        <p className="text-lg text-neutral-600">
          Discover faces, places, numbers, and more from the Sesame Street Archive using computer vision analysis.
        </p>
      </div>

      {/* Search Input Container */}
      <div className="relative mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for faces, places, numbers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Floating Results Container */}
        {(showResults || isSearching) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="ml-2">Searching...</span>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                  Search Results ({results.length})
                </div>
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.title}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isSearching && results.length === 0 && query.trim().length > 0 && (
              <div className="p-4 text-center text-gray-500">
                No results found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Browse Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Character Faces</h3>
          <ul className="space-y-2">
            <li><Link href="/faces/big-bird" className="text-blue-600 hover:underline">Big Bird</Link></li>
            <li><Link href="/faces/elmo" className="text-blue-600 hover:underline">Elmo</Link></li>
            <li><Link href="/faces/cookie-monster" className="text-blue-600 hover:underline">Cookie Monster</Link></li>
            <li><Link href="/faces/oscar" className="text-blue-600 hover:underline">Oscar the Grouch</Link></li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Iconic Places</h3>
          <ul className="space-y-2">
            <li><Link href="/places/main-street" className="text-blue-600 hover:underline"><em>Sesame Street</em></Link></li>
            <li><Link href="/places/kitchen" className="text-blue-600 hover:underline">Kitchen Scenes</Link></li>
            <li><Link href="/places/playground" className="text-blue-600 hover:underline">Playground</Link></li>
            <li><Link href="/places/library" className="text-blue-600 hover:underline">Library</Link></li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Numbers & Counting</h3>
          <ul className="space-y-2">
            <li><Link href="/numbers/1" className="text-blue-600 hover:underline">Number 1</Link></li>
            <li><Link href="/numbers/5" className="text-blue-600 hover:underline">Number 5</Link></li>
            <li><Link href="/numbers/10" className="text-blue-600 hover:underline">Number 10</Link></li>
            <li><Link href="/numbers/counting" className="text-blue-600 hover:underline">Counting Segments</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}