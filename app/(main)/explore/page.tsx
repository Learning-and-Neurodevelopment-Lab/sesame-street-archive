"use client";

import { useState, useEffect, useMemo, useRef, Suspense, Key } from "react";
import { Stage, Layer, Rect, Image as KonvaImage } from "react-konva";
import { useRouter, useSearchParams } from "next/navigation";
import { Spring, animated } from "@react-spring/konva";
import useImage from "use-image";
// Helper to extract EXIF-like info (mocked for now)
function getExifInfo(image: SearchData) {
  return [
    { label: "Filename", value: image.filename },
    { label: "Year", value: image.year },
    { label: "Episode", value: image.episode },
    { label: "Categories", value: image.categories.join(", ") },
    { label: "Title", value: image.episodeTitle },
    // Add more fields as needed
  ].filter((item) => item.value); // Only include if value exists
}

const MAX_WIDTH = 464;
const MAX_HEIGHT = 261;

// Helper component for Konva image with bounding boxes

function KonvaImageWithBoxes({ imageUrl, boxes }) {
  const [image] = useImage(imageUrl);
  const [stageSize, setStageSize] = useState({
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
  });
  const stageRef = useRef(null);

  useMemo(() => {
    if (image && image.width && image.height) {
      const imgW = image.width;
      const imgH = image.height;
      let width = MAX_WIDTH;
      let height = (imgH / imgW) * MAX_WIDTH;
      if (height > MAX_HEIGHT) {
        height = MAX_HEIGHT;
        width = (imgW / imgH) * MAX_HEIGHT;
      }
      setStageSize({ width, height });
    }
  }, [image]);

  const width = 480;

  const AnimatedKonvaImage = animated(KonvaImage);

  return (
    <Stage
      width={stageSize.width}
      height={stageSize.height}
      style={{ width: "100%", height: "100%" }}
      ref={stageRef}
      onContextMenu={(evt) => evt.evt.preventDefault()}
    >
      <Layer>
        <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} delay={500}>
          {({ opacity }) => (
            // @ts-ignore
            <AnimatedKonvaImage
              image={image}
              width={width}
              height={270}
              opacity={opacity}
            />
          )}
        </Spring>
        {boxes &&
          boxes.map(
            (box: {
              id: Key;
              x: number;
              y: number;
              width: number;
              height: number;
            }) => (
              <Rect
                key={box.id}
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                stroke="white"
                strokeWidth={4}
                dash={[6, 4]}
                cornerRadius={4}
                opacity={0.7}
                shadowEnabled={true}
                shadowColor="black"
                shadowBlur={8}
                shadowOffset={{ x: 2, y: 2 }}
                shadowOpacity={0.6}
                background="rgba(255, 0, 255, 0.2)"
              />
            )
          )}
      </Layer>
    </Stage>
  );
}
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import { getUrl } from "aws-amplify/storage";

import { SearchableCombobox } from "@/components/SearchableCombobox";
import { Button } from "@/components/ui/button";

interface SearchData {
  id: string | number;
  filename: string;
  categories: string[];
  annotations: {
    annotationId: any;
    category: string;
    keywords: string[];
    polygon: string | any[];
  }[];
  url?: string; // pre-signed URL from S3
  imagePath: string; // store S-E_ID.png path, not URL
  hasAnnotations: boolean;
  episode: string;
  year: string;
  episodeTitle: string;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  annotation: Schema["Annotation"]["type"];
}

type ImageUrlMap = Record<string, string>; // key: imagePath, value: url

const KEYWORD_OPTIONS = [];

const CATEGORY_OPTIONS = [
  { value: "FACE", label: "Face", color: "#3b82f6" },
  { value: "PLACE", label: "Place", color: "#22c55e" },
  { value: "NUMBER", label: "Number", color: "#a855f7" },
  { value: "WORD", label: "Word", color: "#a42a04" },
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
  const router = useRouter();
  const searchParams = useSearchParams();
  // Modal state
  const [selectedImage, setSelectedImage] = useState<SearchData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchData[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchData[]>([]);
  const [imageUrls, setImageUrls] = useState<ImageUrlMap>({});
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFullscreenResults, setShowFullscreenResults] = useState(false);
  const [searchData, setSearchData] = useState<SearchData[]>([]);
  const [yearOptions, setYearOptions] =
    useState<typeof YEAR_OPTIONS>(YEAR_OPTIONS);
  const [keywordOptions, setKeywordOptions] =
    useState<typeof KEYWORD_OPTIONS>(KEYWORD_OPTIONS);

  const [konvaImage] = useImage(selectedImage?.url || "");

  // Sync state from search params on mount and when params change
  useEffect(() => {
    console.log("Syncing state from search params");
    const parseArray = (val: string | null) =>
      val ? val.split(",").filter(Boolean) : [];
    setQuery(searchParams.get("q") || "");
    setSelectedKeywords(parseArray(searchParams.get("keywords")));
    setSelectedCategories(parseArray(searchParams.get("categories")));
    setSelectedYears(parseArray(searchParams.get("years")));
    setShowAnnotatedOnly(searchParams.get("annotated") === "1");
    setShowFullscreenResults(searchParams.get("fullscreen") === "1");
  }, [searchParams]);

  // Modal state from search params
  useEffect(() => {
    const imageParam = searchParams.get("image");
    if (imageParam && searchData.length > 0) {
      const found = searchData.find((img) => img.imagePath === imageParam);
      if (found) {
        // HEREHERE
        (async () => {
          const imageUrl = await getUrl({ path: `images/${found.imagePath}` });
          setSelectedImage({ ...found, url: imageUrl.url.href });
          setModalOpen(true);
        })();
      } else {
        setModalOpen(false);
        setSelectedImage(null);
      }
    } else {
      setModalOpen(false);
      setSelectedImage(null);
    }
  }, [searchParams, searchData]);

  // Filter states
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [showAnnotatedOnly, setShowAnnotatedOnly] = useState(false);

  // Helper to update search params in URL
  const setSearchParams = (
    params: Record<string, string | string[] | boolean | undefined>
  ) => {
    const sp = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === false ||
        (Array.isArray(value) && value.length === 0)
      ) {
        sp.delete(key);
      } else if (Array.isArray(value)) {
        sp.set(key, value.join(","));
      } else if (typeof value === "boolean") {
        sp.set(key, value ? "1" : "0");
      } else {
        sp.set(key, value);
      }
    });
    router.replace(`?${sp.toString()}`);
  };

  // Sync state from search params on mount and when params change
  useEffect(() => {
    // Helper to parse comma-separated params
    const parseArray = (val: string | null) =>
      val ? val.split(",").filter(Boolean) : [];
    setQuery(searchParams.get("q") || "");
    setSelectedKeywords(parseArray(searchParams.get("keywords")));
    setSelectedCategories(parseArray(searchParams.get("categories")));
    setSelectedYears(parseArray(searchParams.get("years")));
    setShowAnnotatedOnly(searchParams.get("annotated") === "1");
    setShowFullscreenResults(searchParams.get("fullscreen") === "1");
  }, [searchParams]);

  // Modal state from search params
  useEffect(() => {
    const imageParam = searchParams.get("image");
    if (imageParam && searchData.length > 0) {
      const found = searchData.find((img) => img.imagePath === imageParam);
      if (found) {
        setSelectedImage(found);
        setModalOpen(true);
      } else {
        setModalOpen(false);
        setSelectedImage(null);
      }
    } else {
      setModalOpen(false);
      setSelectedImage(null);
    }
  }, [searchParams, searchData]);

  const t = useTranslations("ExplorePage");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setIsAuthenticated(!!user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Search functionality
  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      let searchResults = searchData;
      if (q.length > 0) {
        searchResults = searchData.filter((item) => {
          return (
            (item.filename && item.filename.toLowerCase().includes(q)) ||
            (item.episodeTitle &&
              item.episodeTitle.toLowerCase().includes(q)) ||
            (item.episode && item.episode.toLowerCase().includes(q)) ||
            (item.year && item.year.toLowerCase().includes(q)) ||
            (item.id && String(item.id).toLowerCase().includes(q)) ||
            (item.annotations &&
              item.annotations.some((annotation) => {
                if (typeof annotation?.keywords) {
                  return annotation?.keywords
                    ?.map((s) => s.toLowerCase())
                    .includes(q);
                } else if (annotation?.category) {
                  return annotation.category.toLowerCase().includes(q);
                }
                return false;
              }))
          );
        });
      }
      setResults(searchResults);
      setIsSearching(false);
      setShowResults(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, searchData]);

  useEffect(() => {
    const client = generateClient<Schema>();

    const concatenateImageIdForAnnotations = (
      image: Schema["Image"]["type"]
    ) => {
      return (
        "S" +
        String(image.season) +
        "-E" +
        String(image.episode_id) +
        "_" +
        String(image.image_id)
      );
    };

    const concatenateImageIdForFiltering = (image: Schema["Image"]["type"]) => {
      return (
        "S" +
        String(image.season) +
        "-E" +
        String(image.episode_id) +
        "_" +
        String(image.image_id) +
        ".png"
      );
    };

    (async () => {
      let imageOptions = { limit: 3000 };

      if (isAuthenticated) {
        imageOptions = { limit: 3000 };
      }

      const { data: images } = await client.models.Image.list(imageOptions);

      const yearsSet = new Set<string>();
      images?.forEach((image) => {
        if (image.air_year) {
          yearsSet.add(String(image.air_year));
        }
      });

      setYearOptions(
        Array.from(yearsSet)
          .sort((a, b) => Number(b) - Number(a))
          .map((year) => ({ value: year, label: year }))
      );

      // Collect all keywords in a set
      const allKeywords = new Set<string>();
      const imagesWithAnnotations = await Promise.all(
        images?.map(async (image) => {
          const { data: annotations } = await client.models.Annotation.list({
            filter: {
              image_id: { beginsWith: concatenateImageIdForAnnotations(image) },
            },
          });

          const imagePath = concatenateImageIdForFiltering(image);

          const annotationItems = annotations.map((a) => {
            let polygon: string | any[] = "[]";
            if (typeof a.polygon === "string") {
              try {
                const parsed = JSON.parse(a.polygon);
                polygon = Array.isArray(parsed) ? parsed : a.polygon;
              } catch {
                polygon = a.polygon;
              }
            } else if (Array.isArray(a.polygon)) {
              polygon = a.polygon;
            } else {
              polygon = [];
            }
            // Collect keywords for global set
            if (a.keywords) {
              a.keywords.split(" ").forEach((kw) => allKeywords.add(kw));
            }
            return {
              category: a.category ?? "",
              keywords: a.keywords.split(" ") ?? [],
              polygon,
              annotationId: a.annotation_id,
            };
          });
          const filename =
            image.image_id ?? concatenateImageIdForFiltering(image);
          const yearStr = image.air_year ? String(image.air_year) : "";

          return {
            id: String(image.image_id).padStart(5, "0") || 0,
            filename,
            categories: annotations.map((annotation) => annotation.category),
            annotations: annotationItems,
            imagePath,
            hasAnnotations: annotations.length > 0,
            episode: String(image.episode_id),
            episodeTitle: image.episode_title || "",
            year: yearStr,
          };
        })
      );
      setSearchData(imagesWithAnnotations);
      setKeywordOptions(
        Array.from(allKeywords).map((kw) => ({ value: kw, label: kw }))
      );
    })();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modalOpen) {
          setSearchParams({
            image: undefined,
            fullscreen: showFullscreenResults,
            q: query,
            keywords: selectedKeywords,
            categories: selectedCategories,
            years: selectedYears,
            annotated: showAnnotatedOnly,
          });
        } else if (showFullscreenResults) {
          setSearchParams({
            fullscreen: undefined,
            image: undefined,
            q: query,
            keywords: selectedKeywords,
            categories: selectedCategories,
            years: selectedYears,
            annotated: showAnnotatedOnly,
          });
        }
        setShowResults(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [
    modalOpen,
    showFullscreenResults,
    query,
    selectedKeywords,
    selectedCategories,
    selectedYears,
    showAnnotatedOnly,
  ]);

  // Filter functionality
  useEffect(() => {
    if (searchData.length > 0) {
      let filtered = [];

      for (const item of searchData) {
        if (
          (selectedYears?.includes(item.year) || selectedYears.length === 0) &&
          (selectedCategories?.some((category) =>
            item.categories.includes(category)
          ) ||
            selectedCategories.length === 0) &&
          (selectedKeywords?.some((keywords) =>
            item.annotations.some((annotation) =>
              annotation?.keywords.includes(keywords)
            )
          ) ||
            selectedKeywords.length === 0) &&
          (!showAnnotatedOnly || item.hasAnnotations)
        ) {
          filtered.push(item);
        }
      }

      console.log("Filtered results:", filtered);

      setFilteredResults(filtered);
    }
  }, [
    searchData,
    selectedCategories,
    selectedKeywords,
    selectedYears,
    showAnnotatedOnly,
  ]);

  const clearAllFilters = () => {
    setSelectedKeywords([]);
    setSelectedCategories([]);
    setSelectedYears([]);
    setShowAnnotatedOnly(false);
  };

  const handleSearch = () => {
    setShowFullscreenResults(true);
    setSearchParams({
      categories: selectedCategories,
      keywords: selectedKeywords,
      years: selectedYears,
      annotated: showAnnotatedOnly,
      q: query,
      fullscreen: true,
    });
  };

  // Fetch image URLs when popup is opened
  useEffect(() => {
    if (!showFullscreenResults) return;
    const fetchUrls = async () => {
      const missingPaths = filteredResults
        .filter((r) => !imageUrls[r.imagePath])
        .map((r) => ({ path: r.imagePath, id: r.id }));
      if (missingPaths.length > 0) {
        const newUrls: ImageUrlMap = { ...imageUrls };
        await Promise.all(
          missingPaths.map(async ({ path, id }) => {
            try {
              const s3Path = `images/${path}`;
              const urlObj = await getUrl({ path: s3Path });
              newUrls[id] = urlObj.url.href;
            } catch (err) {
              console.error("Error fetching image URL for", path, err);
              newUrls[id] = "";
            }
          })
        );
        setImageUrls(newUrls);
      }
    };
    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFullscreenResults, filteredResults]);

  const activeFiltersCount =
    selectedKeywords.length +
    selectedCategories.length +
    selectedYears.length +
    (showAnnotatedOnly ? 1 : 0);

  // Download annotations as JSON
  const handleDownloadAnnotations = (image: SearchData) => {
    const data = JSON.stringify(image.annotations, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${image.filename}-annotations.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Navigate to /annotate with current search/query params
  const handleEditAnnotations = async (image: SearchData) => {
    const params = new URLSearchParams(searchParams.toString());
    const imageUrl = await getUrl({ path: `images/${image.imagePath}` });
    params.set("image", imageUrl.url.href);
    router.push(`/annotate?${params.toString()}`);
  };

  // Compute bounding boxes for selected image
  const allBoundingBoxes: BoundingBox[] =
    selectedImage && selectedImage.annotations
      ? (selectedImage.annotations
          .map((annotation) => {
            const polygon =
              typeof annotation.polygon === "string"
                ? (() => {
                    try {
                      return JSON.parse(annotation.polygon);
                    } catch {
                      return [];
                    }
                  })()
                : annotation.polygon;
            if (!Array.isArray(polygon) || polygon.length < 4) return null;
            const [x, y, width, height] = polygon;
            return {
              x: x,
              y: y,
              width: width - x,
              height: height - y,
              id: annotation.annotationId,
              annotation: annotation as any,
            } as BoundingBox;
          })
          .filter(Boolean) as BoundingBox[])
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t("exploreTitle")}</h1>
        <p className="text-lg text-neutral-600">{t("exploreDescription")}</p>
      </div>

      {/* Search Input Container */}
      <div className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={t("explorePlaceholder")}
            value={query}
            onChange={(e) => {
              setSearchParams({
                q: e.target.value,
                keywords: selectedKeywords,
                categories: selectedCategories,
                years: selectedYears,
                annotated: showAnnotatedOnly,
                fullscreen: showFullscreenResults,
                image:
                  modalOpen && selectedImage
                    ? selectedImage.imagePath
                    : undefined,
              });
            }}
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
        {query.length > 0 &&
          (showResults || isSearching) &&
          !showFullscreenResults && (
            <div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
              tabIndex={-1}
              ref={(el) => {
                if (!el) return;
                // Attach click outside handler
                const handleClick = (e: MouseEvent) => {
                  if (!el.contains(e.target as Node)) {
                    setShowResults(false);
                  }
                };
                document.addEventListener("mousedown", handleClick);
                return () =>
                  document.removeEventListener("mousedown", handleClick);
              }}
            >
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
                  {filteredResults.slice(0, 5).map((result) => {
                    return (
                      <button
                        key={result.url || result.imagePath}
                        type="button"
                        onClick={() => {
                          setSearchParams({
                            image: result.imagePath,
                            fullscreen: showFullscreenResults,
                            q: query,
                            keywords: selectedKeywords,
                            categories: selectedCategories,
                            years: selectedYears,
                            annotated: showAnnotatedOnly,
                          });
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 w-full text-left"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {result.id ? (
                            <Image
                              src={imageUrls[result.id] || "/placeholder.png"}
                              alt={result.filename}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover pointer-events-none select-none"
                              loading="lazy"
                              draggable="false"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              Loading…
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {result.filename} • {result.episodeTitle} •{" "}
                            {result.episode} • {result.year}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                            {/* Show multiple category pills only if annotations exist */}
                            {result.hasAnnotations &&
                              result?.categories?.map((category, index) => (
                                <span
                                  key={`${category}-${index}`}
                                  className={`px-2 py-0.5 text-xs rounded-full ${getTypeColor(category)}`}
                                >
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
                      </button>
                    );
                  })}
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
      <Suspense fallback={<div>Loading filters...</div>}>
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t("filterTitle")}
            </h2>
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
                {t("categoryFilter.label")}
              </label>
              <SearchableCombobox
                value={selectedCategories}
                onChange={(value) => {
                  setSearchParams({
                    categories: value as string[],
                    keywords: selectedKeywords,
                    years: selectedYears,
                    annotated: showAnnotatedOnly,
                    q: query,
                    fullscreen: showFullscreenResults,
                  });
                }}
                options={CATEGORY_OPTIONS}
                placeholder={t("categoryFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Keywords Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("keywordFilter.label")}
              </label>
              <SearchableCombobox
                options={keywordOptions}
                value={selectedKeywords}
                onChange={(value) => {
                  setSearchParams({
                    keywords: value as string[],
                    categories: selectedCategories,
                    years: selectedYears,
                    annotated: showAnnotatedOnly,
                    q: query,
                    fullscreen: showFullscreenResults,
                  });
                }}
                placeholder={t("keywordFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("yearFilter.label")}
              </label>
              <SearchableCombobox
                options={yearOptions}
                value={selectedYears}
                onChange={(value) => {
                  setSearchParams({
                    years: value as string[],
                    categories: selectedCategories,
                    keywords: selectedKeywords,
                    annotated: showAnnotatedOnly,
                    q: query,
                    fullscreen: showFullscreenResults,
                  });
                }}
                placeholder={t("yearFilter.placeholder")}
                className="w-full"
                multiple={true}
              />
            </div>

            {/* Annotation Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("annotationStatus.label")}
              </label>
              <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={showAnnotatedOnly}
                  onChange={(e) => {
                    setSearchParams({
                      annotated: e.target.checked,
                      categories: selectedCategories,
                      keywords: selectedKeywords,
                      years: selectedYears,
                      q: query,
                      fullscreen: showFullscreenResults,
                    });
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm">{t("annotationStatus.option")}</span>
              </label>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {t("criteriaLabel", {
                  count: filteredResults.length,
                  total: searchData.length,
                })}
              </p>
            </div>
            <Button onClick={handleSearch} className="min-w-[120px]">
              {t.rich("browseCta", { count: filteredResults.length })}
            </Button>
          </div>
        </div>
      </Suspense>
      {/* Fullscreen Results Grid */}
      {showFullscreenResults && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchParams({
                fullscreen: undefined,
                image: undefined,
                q: query,
                keywords: selectedKeywords,
                categories: selectedCategories,
                years: selectedYears,
                annotated: showAnnotatedOnly,
              });
            }
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg w-full max-w-7xl h-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
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
                onClick={() => {
                  setSearchParams({
                    fullscreen: undefined,
                    image: undefined,
                    q: query,
                    keywords: selectedKeywords,
                    categories: selectedCategories,
                    years: selectedYears,
                    annotated: showAnnotatedOnly,
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Image Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredResults.map((result) => {
                  const imgUrl = imageUrls[result.id] || "";
                  return (
                    <button
                      key={`${result.id}-${result.episode}`}
                      type="button"
                      className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 focus:outline-none"
                      onClick={() => {
                        setSearchParams({
                          image: result.imagePath,
                          fullscreen: true,
                          q: query,
                          keywords: selectedKeywords,
                          categories: selectedCategories,
                          years: selectedYears,
                          annotated: showAnnotatedOnly,
                        });
                      }}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-gray-200 overflow-hidden">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={String(result.id)}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 select-none pointer-events-none"
                            loading="lazy"
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Loading…
                          </div>
                        )}
                      </div>

                      {/* Overlay Info */}
                      <div className="absolute inset-0 bg-transparent group-hover:bg-opacity-60 transition-all duration-200 flex items-end">
                        <div className="p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-200 ">
                          <div className="text-sm font-medium truncate mb-1 text-shadow-sm">
                            {result.filename}
                          </div>
                          <div className="flex items-center gap-1 text-xs flex-wrap">
                            {/* Show multiple category pills only if annotations exist */}

                            {result.hasAnnotations &&
                              result.categories.map((category, index) => (
                                <span
                                  key={`${category}-${index}`}
                                  className={`px-2 py-0.5 rounded-full ${getTypeColor(category)} text-gray-800 mb-1 shadow-sm`}
                                >
                                  {category}
                                </span>
                              ))}

                            {result.hasAnnotations && (
                              <span className="bg-green-500 px-2 py-0.5 rounded-full mb-1 shadow-sm">
                                {result.annotations.length} annotations
                              </span>
                            )}
                            {!result.hasAnnotations && (
                              <span className="bg-gray-500 px-2 py-0.5 rounded-full mb-1 shadow-sm">
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
                    </button>
                  );
                })}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {t.rich("noResults", {
                    primary: (chunks) => (
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {chunks}
                      </h3>
                    ),
                    secondary: (chunks) => (
                      <p className="text-gray-600">{chunks}</p>
                    ),
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for image details and annotation actions */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={(e) => {
            // Only close if click is on the overlay, not inside the modal
            if (e.target === e.currentTarget) {
              setSearchParams({
                image: undefined,
                fullscreen: showFullscreenResults,
                q: query,
                keywords: selectedKeywords,
                categories: selectedCategories,
                years: selectedYears,
                annotated: showAnnotatedOnly,
              });
            }
          }}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => {
                setSearchParams({
                  image: undefined,
                  fullscreen: showFullscreenResults,
                  q: query,
                  keywords: selectedKeywords,
                  categories: selectedCategories,
                  years: selectedYears,
                  annotated: showAnnotatedOnly,
                });
              }}
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full aspect-video bg-gray-200 rounded overflow-hidden flex items-center justify-center m-4 relative">
                {imageUrls[selectedImage.id] ? (
                  <KonvaImageWithBoxes
                    imageUrl={imageUrls[selectedImage.id]}
                    boxes={allBoundingBoxes}
                  />
                ) : (
                  <span className="text-gray-400">Loading…</span>
                )}
              </div>
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">Image Details</h3>
                <ul className="mb-4">
                  {getExifInfo(selectedImage).map((item, index) => (
                    <li
                      key={`${item.label}-${index}`}
                      className="flex justify-between text-sm py-0.5"
                    >
                      <span className="font-medium text-gray-700">
                        {item.label}:
                      </span>
                      <span className="text-gray-900">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <h4 className="font-medium mb-1">Annotations</h4>
                {selectedImage.hasAnnotations ? (
                  <ul className="mb-2">
                    {selectedImage.annotations.map((ann, index) => (
                      <li key={index} className="text-sm text-gray-800">
                        {ann.category} - Keywords: {ann.keywords.join(", ")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500 mb-2">
                    No annotations available.
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadAnnotations(selectedImage)}
                    disabled={!selectedImage.hasAnnotations}
                  >
                    Download Annotations
                  </Button>
                  <Button onClick={() => handleEditAnnotations(selectedImage)}>
                    Edit Annotations
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      <section className="mt-12">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mr-4">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
              {t("browseTips.title")}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-gray-900 font-medium">
                {t("browseTips.tips.annotated")}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="2" />
              </svg>
              <span className="text-gray-900 font-medium">
                {t("browseTips.tips.categories")}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="4" y="8" width="16" height="8" rx="2" />
                <path d="M8 8V6a4 4 0 1 1 8 0v2" />
              </svg>
              <span className="text-gray-900 font-medium">
                {t("browseTips.tips.filters")}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
              </svg>
              <span className="text-gray-900 font-medium">
                {t("browseTips.tips.search")}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 9h8M8 13h6" />
              </svg>
              <span className="text-gray-900 font-medium">
                {t("browseTips.tips.image")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
