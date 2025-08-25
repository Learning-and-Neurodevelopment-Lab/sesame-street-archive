"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SearchableCombobox } from "@/components/SearchableCombobox";

// Mock search data - replace with your actual data source
const searchData = [
  {
    id: 1,
    title: "Big Bird Face Detection - Episode 4550",
    type: "face",
    url: "/faces/big-bird",
  },
  { id: 2, title: "Elmo Close-up Analysis", type: "face", url: "/faces/elmo" },
  {
    id: 3,
    title: "Sesame Street Set - Main Street",
    type: "place",
    url: "/places/main-street",
  },
  {
    id: 4,
    title: "Cookie Monster's Kitchen",
    type: "place",
    url: "/places/kitchen",
  },
  {
    id: 5,
    title: "Number 8 Segment Analysis",
    type: "number",
    url: "/numbers/8",
  },
  {
    id: 6,
    title: "Counting to 10 with The Count",
    type: "number",
    url: "/numbers/10",
  },
  {
    id: 7,
    title: "Oscar's Trash Can Location",
    type: "place",
    url: "/places/trash-can",
  },
  {
    id: 8,
    title: "Bert and Ernie Facial Recognition",
    type: "face",
    url: "/faces/bert-ernie",
  },
];

const KEYWORD_OPTIONS = [
  { value: "puppet", label: "puppet" },
  { value: "human", label: "human" },
  { value: "animal", label: "animal" },
  { value: "infant", label: "infant" },
  { value: "child", label: "child" },
  { value: "teen", label: "teen" },
  { value: "adult", label: "adult" },
  { value: "elderly", label: "elderly" },
  { value: "forward", label: "forward" },
  { value: "full-view", label: "full-view" },
  { value: "close-up", label: "close-up" },
  { value: "occluded", label: "occluded" },
  { value: "truncated", label: "truncated" },
  { value: "oblique", label: "oblique" },
  { value: "single", label: "single" },
  { value: "multiple", label: "multiple" },
  { value: "skyline", label: "skyline" },
  { value: "domicile", label: "domicile" },
  { value: "business", label: "business" },
  { value: "house", label: "house" },
  { value: "clear", label: "clear" },
  { value: "blurry", label: "blurry" },
];

const CATEGORY_OPTIONS = [
  { value: "face", label: "Face" },
  { value: "place", label: "Place" },
  { value: "number", label: "Number" },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "face":
      return "bg-blue-100 text-blue-800";
    case "place":
      return "bg-green-100 text-green-800";
    case "number":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof searchData>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]); // Changed to array
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const filteredResults = searchData.filter((item) =>
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
          Discover faces, places, numbers, and more from the Sesame Street
          Archive using computer vision analysis.
        </p>
      </div>

      {/* Search Input Container */}
      <div className="relative mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for ..."
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
                        <div className="font-medium text-gray-900">
                          {result.title}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                          result.type
                        )}`}
                      >
                        {result.type}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!isSearching &&
              results.length === 0 &&
              query.trim().length > 0 && (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}
          </div>
        )}
      </div>

      {/* Browse Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Character Faces</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/faces/big-bird"
                className="text-blue-600 hover:underline"
              >
                Big Bird
              </Link>
            </li>
            <li>
              <Link
                href="/faces/elmo"
                className="text-blue-600 hover:underline"
              >
                Elmo
              </Link>
            </li>
            <li>
              <Link
                href="/faces/cookie-monster"
                className="text-blue-600 hover:underline"
              >
                Cookie Monster
              </Link>
            </li>
            <li>
              <Link
                href="/faces/oscar"
                className="text-blue-600 hover:underline"
              >
                Oscar the Grouch
              </Link>
            </li>
          </ul>
        </div> */}

        {/* <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Iconic Places</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/places/main-street"
                className="text-blue-600 hover:underline"
              >
                Street
              </Link>
            </li>
            <li>
              <Link
                href="/places/kitchen"
                className="text-blue-600 hover:underline"
              >
                Kitchen Scenes
              </Link>
            </li>
            <li>
              <Link
                href="/places/playground"
                className="text-blue-600 hover:underline"
              >
                Playground
              </Link>
            </li>
            <li>
              <Link
                href="/places/library"
                className="text-blue-600 hover:underline"
              >
                Library
              </Link>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Numbers & Counting
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/numbers/1" className="text-blue-600 hover:underline">
                Number 1
              </Link>
            </li>
            <li>
              <Link href="/numbers/5" className="text-blue-600 hover:underline">
                Number 5
              </Link>
            </li>
            <li>
              <Link
                href="/numbers/10"
                className="text-blue-600 hover:underline"
              >
                Number 10
              </Link>
            </li>
          </ul>
        </div> */}

        <section className="col-span-full">
          <div>
            <main className="main-content">
              <h1 className="text-xl mb-6">Filters</h1>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="search-control">
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-2 lg"
                    >
                      Category
                    </label>
                    <SearchableCombobox
                      options={CATEGORY_OPTIONS}
                      value={selectedCategories}
                      onChange={(value) =>
                        setSelectedCategories(value as string[])
                      }
                      placeholder="Search and select keywords..."
                      className="w-full"
                      multiple={true}
                    />
                    {/* <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All</option>
                      <option value="FACE">Face</option>
                      <option value="PLACE">Place</option>
                      <option value="NUMBER">Number</option>
                      <option value="WORD">Word</option>
                    </select> */}
                  </div>

                  <div className="search-control">
                    <label
                      htmlFor="keywords"
                      className="block text-sm font-medium text-gray-700 mb-2 lg"
                    >
                      Keywords
                    </label>
                    <SearchableCombobox
                      options={KEYWORD_OPTIONS}
                      value={selectedKeywords}
                      onChange={(value) =>
                        setSelectedKeywords(value as string[])
                      }
                      placeholder="Search and select keywords..."
                      className="w-full"
                      multiple={true}
                    />
                    {/* <button
                      onClick={() => setSelectedKeywords([])}
                      className="mt-2 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Clear All
                    </button> */}
                  </div>
                </div>

                {/* {selectedKeywords.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Selected Keywords ({selectedKeywords.length}):</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedKeywords.map((keyword) => {
                      const option = KEYWORD_OPTIONS.find(
                        (opt) => opt.value === keyword
                      );
                      return (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {option?.label || keyword}
                          <button
                            onClick={() =>
                              setSelectedKeywords((prev) =>
                                prev.filter((k) => k !== keyword)
                              )
                            }
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {selectedCategories.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Selected Categories ({selectedCategories.length}):</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => {
                      const option = CATEGORY_OPTIONS.find(
                        (opt) => opt.value === category
                      );
                      return (
                        <span
                          key={category}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                        >
                          {option?.label || category}
                          <button
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.filter((c) => c !== category)
                              )
                            }
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )} */}

                {/* <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 text-lg">ℹ️</span>
                    <div>
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Available Keywords:</strong> human, puppet, animal,
                        infant, child, teen, adult, elderly, Asian, American
                        Indian/Alaska Native, Black/African American, Native
                        Hawaiian/Other Pacific Islander, white, occluded, truncated,
                        oblique, cardinal, close-up, single, multiple, skyline,
                        domicile, business, attraction, institution, single-letter,
                        word, nonword, pronounceable, full-view, single-digit,
                        multi-digit, uppercase, lowercase, house, row-house,
                        apartment, castle, clear, blurry, front-face, side-profile,
                        forward, downward, upward, proper noun, real or caricature.
                      </p>
                      <p className="text-sm text-blue-700">
                        For a full explanation of the terms used in the SSA see the{" "}
                        <Link
                          href="/guide"
                          className="underline hover:text-blue-900"
                        >
                          Guide
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* <p className="text-sm text-gray-600">
                  Click image for annotation details.
                </p>

                <div className="text-center py-8 text-gray-500">
                  <p>
                    Search results will appear here based on selected criteria.
                  </p>
                </div> */}
              </div>
            </main>
          </div>
        </section>
      </div>
    </div>
  );
}
