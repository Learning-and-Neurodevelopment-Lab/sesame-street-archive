"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchableCombobox } from "@/components/SearchableCombobox";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";


import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl } from 'aws-amplify/storage';
// import AnnotatedImage from "./AnnotatedImage";
import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';

import CustomHeader from '@/components/CustomHeader';
// import AnnotationDataViewerToggle from "./AnnotationDataViewerToggle";
import { FetchImageUrls } from "@/components/FetchImageUrls";

// Import your image assets
import one from '@/assets/annotated-examples/03212.png';
import two from '@/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/assets/annotated-examples/S35-E4058_00212.png';
import four from '@/assets/annotated-examples/S35-E4058_00332.png';
import { url } from "inspector";

type SearchData = {
  id: number;
  filename: string;
  categories: string[];
  url: string;
  annotations: string[];
  image: string;
  hasAnnotations: boolean;
  episode: string;
  year: string;
};

// Simplified search data structure
// const searchData = [
//   {
//     id: 1,
//     filename: "03212.png",
//     categories: ["face"], // Only show categories if annotations exist
//     url: `/annotate?image=${one.src}`,
//     annotations: ["Big Bird", "Face", "Puppet"],
//     image: one,
//     hasAnnotations: true,
//     episode: "Episode 4550",
//     year: "2015"
//   },
//   {
//     id: 2,
//     filename: "S35-E4057_01283.png",
//     categories: ["face"],
//     url: `/annotate?image=${two.src}`,
//     annotations: ["Elmo", "Face", "Close-up"],
//     image: two,
//     hasAnnotations: true,
//     episode: "Episode 4421",
//     year: "2014"
//   },
//   {
//     id: 3,
//     filename: "S35-E4058_00212.png",
//     categories: ["place", "face"], // Multiple categories example
//     url: `/annotate?image=${three.src}`,
//     annotations: ["Main Street", "Outdoor", "Full View", "Big Bird", "Elmo"],
//     image: three,
//     hasAnnotations: true,
//     episode: "Episode 4601",
//     year: "2016"
//   },
//   {
//     id: 4,
//     filename: "S35-E4058_00332.png",
//     categories: ["place", "number"], // Multiple categories example
//     url: `/annotate?image=${four.src}`,
//     annotations: ["Kitchen", "Indoor", "Clear", "Number 5"],
//     image: four,
//     hasAnnotations: true,
//     episode: "Episode 4312",
//     year: "2013"
//   },
//   {
//     id: 5,
//     filename: "number_8_frame.png",
//     categories: ["number"],
//     url: `/annotate?image=${one.src}`,
//     annotations: ["Number 8", "Single Digit"],
//     image: one,
//     hasAnnotations: true,
//     episode: "Episode 4701",
//     year: "2017"
//   },
//   {
//     id: 6,
//     filename: "count_von_count.png",
//     categories: ["face", "number"], // Multiple categories example
//     url: `/annotate?image=${two.src}`,
//     annotations: ["Count", "Vampire", "Purple", "Numbers"],
//     image: two,
//     hasAnnotations: true,
//     episode: "Episode 4502",
//     year: "2015"
//   },
//   {
//     id: 7,
//     filename: "hoopers_store.png",
//     categories: [], // No categories when no annotations
//     url: `/annotate?image=${three.src}`,
//     annotations: [],
//     image: three,
//     hasAnnotations: false,
//     episode: "Episode 4625",
//     year: "2016"
//   },
//   {
//     id: 8,
//     filename: "number_3_segment.png",
//     categories: [], // No categories when no annotations
//     url: `/annotate?image=${four.src}`,
//     annotations: [],
//     image: four,
//     hasAnnotations: false,
//     episode: "Episode 4435",
//     year: "2014"
//   },
// ];

const KEYWORD_OPTIONS = [
  { value: "puppet", label: "Puppet" },
  { value: "human", label: "Human" },
  { value: "animal", label: "Animal" },
  { value: "face", label: "Face" },
  { value: "close-up", label: "Close-up" },
  { value: "full-view", label: "Full View" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
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

const YEAR_OPTIONS = Array.from({ length: 25 }, (_, i) => ({
  value: (2024 - i).toString(),
  label: (2024 - i).toString(),
}));

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
  const [results, setResults] = useState<SearchData[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFullscreenResults, setShowFullscreenResults] = useState(false);
  const [searchData, setSearchData] = useState<SearchData[]>([]);

  // Filter states
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [showAnnotatedOnly, setShowAnnotatedOnly] = useState(false);

  const t = useTranslations("ExplorePage");

  // Search functionality
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = query.trim().length > 0 
        ? searchData.filter((item) =>
            item.filename.toLowerCase().includes(query.toLowerCase()) ||
            item.annotations.some(annotation => 
              annotation.toLowerCase().includes(query.toLowerCase())
            )
          )
        : searchData;
      
      setResults(searchResults);
      setIsSearching(false);
      setShowResults(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    (async() => {
      const client = generateClient<Schema>();

      const { data: images, errors: imageErrors } = await client.models.Image.list({
        filter: { season: { eq: 48 } } as any
      });

      const imagesWithAnnotations = await Promise.all(images?.map(async (image) => {
        const compositeId = `S${image.season}-E${image.episode_id}_${image.image_id}`;

        const { data: annotations, errors: annotationErrors } = await client.models.Annotation.list({
          filter: {
            and: [
              { image_id: { beginsWith: `S${image.season}` } },
              { image_id: { contains: `E${image.episode_id}` } }
            ]
          } as any
        });

        const concatenateImageIdForAnnotations = (image: Schema["Image"]["type"]) => {
          return "S" + String(image.season)+"-E" +String(image.episode_id) +"_" +String(image.image_id) + ".png";
        }

        const imageURL = await getUrl({ path: `images/${concatenateImageIdForAnnotations(image)}` });

        // Map annotation objects to string labels for compatibility
        const annotationLabels = annotations.map(a => a.category ?? "");

        // Use image.image_id as filename if available, otherwise fallback
        const filename = image.image_id ?? compositeId;

        // Convert year to string for compatibility
        const yearStr = image.air_year ? String(image.air_year) : "";

        // Use a placeholder image if StaticImageData is required and imageURL is not compatible
        // For now, use imageURL.url.href directly, but you may need to convert it to StaticImageData if needed
        const dataset = {
          id: Number(image.image_id) || 0,
          filename,
          categories: annotations.map(annotation => annotation.category),
          url: `/annotate?image=${imageURL.url.href}`,
          annotations: annotationLabels,
          image: imageURL.url.href,
          hasAnnotations: annotations.length > 0,
          episode: String(image.episode_id),
          year: yearStr,
        };

        return dataset;
      }));

      setSearchData(imagesWithAnnotations);
      setFilteredResults(imagesWithAnnotations);

      const fetchImageUrl = async (imageId: string): Promise<string | undefined> => {
        try {
          const result = await getUrl({ path: `images/${imageId}` });  
          return result.url.href;
        } catch (error) {
          console.error(`Failed to fetch URL for image ID: ${imageId}`, error);
          return undefined;
        }
      };
    })();
  }, []);
  
  // Filter functionality
  useEffect(() => {
    let filtered = results;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.some(category => item.categories.includes(category))
      );
    }

    // Apply keyword filter
    if (selectedKeywords.length > 0) {
      filtered = filtered.filter((item) =>
        selectedKeywords.some((keyword) => 
          item.annotations.some(annotation =>
            annotation.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
    }

    // Apply year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter((item) => selectedYears.includes(item.year));
    }

    // Apply annotation filter
    if (showAnnotatedOnly) {
      filtered = filtered.filter((item) => item.hasAnnotations);
    }

    setFilteredResults(filtered);
  }, [results, selectedCategories, selectedKeywords, selectedYears, showAnnotatedOnly]);

  const clearAllFilters = () => {
    setSelectedKeywords([]);
    setSelectedCategories([]);
    setSelectedYears([]);
    setShowAnnotatedOnly(false);
  };

  const handleSearch = () => {
    setShowFullscreenResults(true);
  };

  const activeFiltersCount =
    selectedKeywords.length +
    selectedCategories.length +
    selectedYears.length +
    (showAnnotatedOnly ? 1 : 0);

  return (
    <Authenticator hideSignUp components={{ Header: CustomHeader }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{t("exploreTitle")}</h1>
          <p className="text-lg text-neutral-600">
            {t("exploreDescription")}
          </p>
        </div>

        {/* Search Input Container */}
        <div className="relative mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder={t("explorePlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
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

          {/* Quick Preview Results */}
          {query.length > 0 && (showResults || isSearching) && !showFullscreenResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {isSearching && (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="ml-2">Searching…</span>
                </div>
              )}

              {!isSearching && filteredResults.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b flex justify-between items-center">
                    <span>Images ({filteredResults.length} results)</span>
                    <button
                      onClick={handleSearch}
                      className="text-blue-600 text-xs hover:text-blue-800"
                    >
                      View All →
                    </button>
                  </div>
                  {filteredResults.slice(0, 5).map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={result.image}
                          alt={result.filename}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {result.filename}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                          {/* Show multiple category pills only if annotations exist */}
                          {result.hasAnnotations && result?.categories?.map((category) => (
                            <span key={category} className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(category)}`}>
                              {category}
                            </span>
                          ))}
                          {result.hasAnnotations && (
                            <span className="text-xs text-green-600">
                              {result.annotations.length} annotations
                            </span>
                          )}
                          {!result.hasAnnotations && (
                            <span className="text-xs text-gray-400">
                              No annotations
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!isSearching && filteredResults.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No images found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{t("filterTitle")}</h2>
            <div className="flex items-center gap-4">
              {activeFiltersCount > 0 && (
                <span className="text-sm text-gray-600">
                  {t.rich("activeFilters", { count: activeFiltersCount })}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                disabled={activeFiltersCount === 0}
              >
                {t("filterClearCta")}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('categoryFilter.label')}
              </label>
              <SearchableCombobox
                options={CATEGORY_OPTIONS}
                value={selectedCategories}
                onChange={(value) => setSelectedCategories(value as string[])}
                placeholder={t("categoryFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Keywords Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('keywordFilter.label')}
              </label>
              <SearchableCombobox
                options={KEYWORD_OPTIONS}
                value={selectedKeywords}
                onChange={(value) => setSelectedKeywords(value as string[])}
                placeholder={t("keywordFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('yearFilter.label')}
              </label>
              <SearchableCombobox
                options={YEAR_OPTIONS}
                value={selectedYears}
                onChange={(value) => setSelectedYears(value as string[])}
                placeholder={t("yearFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Annotation Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('annotationStatus.label')}
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={showAnnotatedOnly}
                  onChange={(e) => setShowAnnotatedOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{t('annotationStatus.option')}</span>
              </label>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {t('criteriaLabel', { count: filteredResults.length, total: searchData.length })}
              </p>
            </div>
            <Button onClick={handleSearch} className="min-w-[120px]">
              {t.rich("browseCta", { count: filteredResults.length })}
            </Button>
          </div>
        </div>

        {/* Fullscreen Results Grid */}
        {showFullscreenResults && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Images</h2>
                  <p className="text-gray-600 mt-1">
                    {filteredResults.length} images
                    {query.trim().length > 0 && ` matching "${query}"`}
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

              {/* Image Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filteredResults.map((result) => (
                    <Link
                      key={`${result.id}-${result.episode}`}
                      href={result.url}
                      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
                      onClick={() => setShowFullscreenResults(false)}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-gray-200 overflow-hidden">
                        <Image
                          src={result.image}
                          alt={String(result.id)}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-transparent group-hover:bg-opacity-60 transition-all duration-200 flex items-end">
                        <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ">
                          <div className="text-sm font-medium truncate mb-1">
                            {result.filename}
                          </div>
                          <div className="flex items-center gap-1 text-xs flex-wrap">
                            {/* Show multiple category pills only if annotations exist */}
                            {result.hasAnnotations && result.categories.map((category) => (
                              <span key={category} className={`px-2 py-0.5 rounded-full ${getTypeColor(category)} text-gray-800 mb-1`}>
                                {category}
                              </span>
                            ))}
                            {result.hasAnnotations && (
                              <span className="bg-green-500 px-2 py-0.5 rounded-full mb-1">
                                {result.annotations.length} annotations
                              </span>
                            )}
                            {!result.hasAnnotations && (
                              <span className="bg-gray-500 px-2 py-0.5 rounded-full mb-1">
                                No annotations
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Top-right status indicator */}
                      <div className="absolute top-2 right-2">
                        {result.hasAnnotations ? (
                          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        ) : (
                          <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredResults.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {t.rich("noResults", {
                      primary: (chunks) => <h3 className="text-lg font-medium text-gray-900 mb-2">{chunks}</h3>,
                      secondary: (chunks) => <p className="text-gray-600">{chunks}</p>
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Help Information */}
        <section className="mt-12">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mr-4">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{t("browseTips.title")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-gray-900 font-medium">{t('browseTips.tips.annotated')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="2" /></svg>
                <span className="text-gray-900 font-medium">{t('browseTips.tips.categories')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="2" /><path d="M8 8V6a4 4 0 1 1 8 0v2" /></svg>
                <span className="text-gray-900 font-medium">{t('browseTips.tips.filters')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /></svg>
                <span className="text-gray-900 font-medium">{t('browseTips.tips.search')}</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 9h8M8 13h6" /></svg>
                <span className="text-gray-900 font-medium">{t('browseTips.tips.image')}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Authenticator>
  );
}
