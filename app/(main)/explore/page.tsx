"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchableCombobox } from "@/components/SearchableCombobox";
import { Button } from "@/components/ui/button";

// Import your image assets
import one from '@/app/(main)/assets/annotated-examples/03212.png';
import two from '@/app/(main)/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/app/(main)/assets/annotated-examples/S35-E4058_00212.png';
import four from '@/app/(main)/assets/annotated-examples/S35-E4058_00332.png';

// Mock search data - replace with your actual data source
const searchData = [
  {
    id: 1,
    title: "Big Bird Face Detection - Episode 4550",
    type: "face",
    url: "/faces/big-bird",
    keywords: ["puppet", "forward", "close-up", "single"],
    season: "Season 45",
    episode: "Episode 4550",
    year: "2015",
    image: one,
    description: "Analysis of Big Bird's facial expressions and recognition patterns in educational segments."
  },
  {
    id: 2,
    title: "Elmo Close-up Analysis",
    type: "face",
    url: "/faces/elmo",
    keywords: ["puppet", "forward", "close-up", "single"],
    season: "Season 44",
    episode: "Episode 4421",
    year: "2014",
    image: two,
    description: "Detailed study of Elmo's facial features and emotional expressions during learning activities."
  },
  {
    id: 3,
    title: "Sesame Street Set - Main Street",
    type: "place",
    url: "/places/main-street",
    keywords: ["domicile", "clear", "full-view"],
    season: "Season 46",
    episode: "Episode 4601",
    year: "2016",
    image: three,
    description: "Comprehensive analysis of the iconic Sesame Street neighborhood setting."
  },
  {
    id: 4,
    title: "Cookie Monster's Kitchen",
    type: "place",
    url: "/places/kitchen",
    keywords: ["business", "clear", "full-view"],
    season: "Season 43",
    episode: "Episode 4312",
    year: "2013",
    image: four,
    description: "Study of indoor kitchen environment and cooking-related educational content."
  },
  {
    id: 5,
    title: "Number 8 Segment Analysis",
    type: "number",
    url: "/numbers/8",
    keywords: ["single-digit", "clear", "forward"],
    season: "Season 47",
    episode: "Episode 4701",
    year: "2017",
    image: one,
    description: "Mathematical learning segment featuring the number 8 with visual recognition analysis."
  },
  {
    id: 6,
    title: "Count von Count Face Recognition",
    type: "face",
    url: "/faces/count",
    keywords: ["puppet", "forward", "close-up", "single"],
    season: "Season 45",
    episode: "Episode 4502",
    year: "2015",
    image: two,
    description: "Character analysis of Count von Count during number-focused educational segments."
  },
  {
    id: 7,
    title: "Hooper's Store Interior",
    type: "place",
    url: "/places/hoopers-store",
    keywords: ["business", "clear", "full-view"],
    season: "Season 46",
    episode: "Episode 4625",
    year: "2016",
    image: three,
    description: "Interior setting analysis of the neighborhood store location."
  },
  {
    id: 8,
    title: "Number 3 Recognition Study",
    type: "number",
    url: "/numbers/3",
    keywords: ["single-digit", "clear", "forward"],
    season: "Season 44",
    episode: "Episode 4435",
    year: "2014",
    image: four,
    description: "Computer vision analysis of number 3 presentations in educational contexts."
  },
];

const KEYWORD_OPTIONS = [
  { value: "puppet", label: "Puppet" },
  { value: "human", label: "Human" },
  { value: "animal", label: "Animal" },
  { value: "infant", label: "Infant" },
  { value: "child", label: "Child" },
  { value: "teen", label: "Teen" },
  { value: "adult", label: "Adult" },
  { value: "elderly", label: "Elderly" },
  { value: "forward", label: "Forward" },
  { value: "full-view", label: "Full View" },
  { value: "close-up", label: "Close-up" },
  { value: "occluded", label: "Occluded" },
  { value: "truncated", label: "Truncated" },
  { value: "oblique", label: "Oblique" },
  { value: "single", label: "Single" },
  { value: "multiple", label: "Multiple" },
  { value: "skyline", label: "Skyline" },
  { value: "domicile", label: "Domicile" },
  { value: "business", label: "Business" },
  { value: "house", label: "House" },
  { value: "clear", label: "Clear" },
  { value: "blurry", label: "Blurry" },
  { value: "single-digit", label: "Single Digit" },
  { value: "multi-digit", label: "Multi Digit" },
];

const CATEGORY_OPTIONS = [
  { value: "face", label: "Face", color: "#3b82f6" },
  { value: "place", label: "Place", color: "#22c55e" },
  { value: "number", label: "Number", color: "#a855f7" },
];

const SEASON_OPTIONS = Array.from({ length: 50 }, (_, i) => ({
  value: `season-${i + 1}`,
  label: `Season ${i + 1}`,
}));

const YEAR_OPTIONS = Array.from({ length: 25 }, (_, i) => ({
  value: (2024 - i).toString(),
  label: (2024 - i).toString(),
}));

const RATING_OPTIONS = [
  { value: "1", label: "1 Star & Up" },
  { value: "2", label: "2 Stars & Up" },
  { value: "3", label: "3 Stars & Up" },
  { value: "4", label: "4 Stars & Up" },
  { value: "5", label: "5 Stars Only" },
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
  const [filteredResults, setFilteredResults] = useState<typeof searchData>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFullscreenResults, setShowFullscreenResults] = useState(false);

  // Filter states
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string>("");
  const [minVotes, setMinVotes] = useState("");

  // Search functionality
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const searchResults = searchData.filter((item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(searchResults);
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

  // Filter functionality
  useEffect(() => {
    let filtered = results;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.type)
      );
    }

    // Apply keyword filter
    if (selectedKeywords.length > 0) {
      filtered = filtered.filter((item) =>
        selectedKeywords.some((keyword) => item.keywords.includes(keyword))
      );
    }

    // Apply year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((item) => selectedYears.includes(item.year));
    }

    setFilteredResults(filtered);
  }, [results, selectedCategories, selectedKeywords, selectedYears]);

  const clearAllFilters = () => {
    setSelectedKeywords([]);
    setSelectedCategories([]);
    setSelectedSeasons([]);
    setSelectedYears([]);
    setSelectedRating("");
    setMinVotes("");
  };

  const handleSearch = () => {
    if (filteredResults.length > 0) {
      setShowFullscreenResults(true);
    }
  };

  const activeFiltersCount =
    selectedKeywords.length +
    selectedCategories.length +
    selectedSeasons.length +
    selectedYears.length +
    (selectedRating ? 1 : 0) +
    (minVotes ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Explore the Archive</h1>
        <p className="text-lg text-neutral-600">
          Discover faces, places, numbers, and more from the Sesame Street
          Archive using computer vision analysis.
        </p>
      </div>

      {/* Search Input Container */}
      <div className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search annotations, episodes, characters..."
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

        {/* Floating Results Container - Quick Preview */}
        {(showResults || isSearching) && !showFullscreenResults && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {isSearching && (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="ml-2">Searching...</span>
              </div>
            )}

            {!isSearching && filteredResults.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b flex justify-between items-center">
                  <span>Quick Preview ({filteredResults.length} results)</span>
                  <button
                    onClick={handleSearch}
                    className="text-blue-600 text-xs hover:text-blue-800"
                  >
                    View All Results →
                  </button>
                </div>
                {filteredResults.slice(0, 5).map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {result.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.season} • {result.year}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            result.type
                          )}`}
                        >
                          {result.type}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {filteredResults.length > 5 && (
                  <div className="px-4 py-2 text-center border-t border-gray-100">
                    <button
                      onClick={handleSearch}
                      className="text-blue-600 text-sm hover:text-blue-800 font-medium"
                    >
                      View all {filteredResults.length} results
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isSearching && filteredResults.length === 0 && results.length > 0 && (
              <div className="p-4 text-center text-gray-500">
                No results match your current filters. Try adjusting your search
                criteria.
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

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
          <div className="flex items-center gap-4">
            {activeFiltersCount > 0 && (
              <span className="text-sm text-gray-600">
                {activeFiltersCount} filter
                {activeFiltersCount > 1 ? "s" : ""} applied
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              disabled={activeFiltersCount === 0}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <SearchableCombobox
              options={CATEGORY_OPTIONS}
              value={selectedCategories}
              onChange={(value) => setSelectedCategories(value as string[])}
              placeholder="Select categories..."
              className="w-full"
              multiple={true}
            />
          </div>

          {/* Keywords Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords
            </label>
            <SearchableCombobox
              options={KEYWORD_OPTIONS}
              value={selectedKeywords}
              onChange={(value) => setSelectedKeywords(value as string[])}
              placeholder="Select keywords..."
              className="w-full"
              multiple={true}
            />
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <SearchableCombobox
              options={YEAR_OPTIONS}
              value={selectedYears}
              onChange={(value) => setSelectedYears(value as string[])}
              placeholder="Select years..."
              className="w-full"
              multiple={true}
            />
          </div>

          {/* Season Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Season
            </label>
            <SearchableCombobox
              options={SEASON_OPTIONS}
              value={selectedSeasons}
              onChange={(value) => setSelectedSeasons(value as string[])}
              placeholder="Select seasons..."
              className="w-full"
              multiple={true}
            />
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Annotation Quality
            </label>
            <SearchableCombobox
              options={RATING_OPTIONS}
              value={selectedRating}
              onChange={(value) => setSelectedRating(value as string)}
              placeholder="Select minimum rating..."
              className="w-full"
              multiple={false}
            />
          </div>

          {/* Min Votes Filter */}
          <div>
            <label
              htmlFor="minVotes"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Annotations
            </label>
            <input
              type="number"
              id="minVotes"
              value={minVotes}
              onChange={(e) => setMinVotes(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            {results.length > 0 && (
              <p className="text-sm text-gray-600">
                {filteredResults.length} of {results.length} results match your criteria
              </p>
            )}
          </div>
          <Button
            onClick={handleSearch}
            disabled={filteredResults.length === 0}
            className="min-w-[120px]"
          >
            {filteredResults.length > 0 ? `Search ${filteredResults.length} Results` : 'Search'}
          </Button>
        </div>
      </div>

      {/* Fullscreen Results Popover */}
      {showFullscreenResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Search Results</h2>
                <p className="text-gray-600 mt-1">
                  {filteredResults.length} results found
                  {query && ` for "${query}"`}
                </p>
              </div>
              <button
                onClick={() => setShowFullscreenResults(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Results Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResults.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                    onClick={() => setShowFullscreenResults(false)}
                  >
                    <div className="aspect-video bg-gray-200 overflow-hidden">
                      <Image
                        src={result.image}
                        alt={result.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(
                            result.type
                          )}`}
                        >
                          {result.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.year}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {result.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {result.season} • {result.episode}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="bg-blue-50 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 text-blue-600 flex-shrink-0">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Search Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use the search bar to find specific content or episodes</li>
              <li>• Apply multiple filters to narrow down results</li>
              <li>• Keywords describe visual characteristics of annotations</li>
              <li>• Click the search button to view detailed results in fullscreen</li>
              <li>
                • For detailed explanations, visit the{" "}
                <Link
                  href="/guide"
                  className="underline hover:text-blue-900"
                >
                  annotation guide
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
