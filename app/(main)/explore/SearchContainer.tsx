"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, 
      gcTime: 0,
      retry: 3,
    },
  }
});

import React, { useCallback, useMemo } from "react";
import Search from "./Search";

const parseArray = (val: string | null) =>
  val ? val.split(",").filter(Boolean) : [];

export default function SearchContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchParamsString = searchParams.toString();

  const selectedKeywords = useMemo(
    () => parseArray(new URLSearchParams(searchParamsString).get("keywords")),
    [searchParamsString]
  );
  const selectedCategories = useMemo(
    () => parseArray(new URLSearchParams(searchParamsString).get("categories")),
    [searchParamsString]
  );
  const selectedYears = useMemo(
    () => parseArray(new URLSearchParams(searchParamsString).get("years")),
    [searchParamsString]
  );
  const showAnnotatedOnly = useMemo(
    () => new URLSearchParams(searchParamsString).get("annotated") === "1",
    [searchParamsString]
  );
  const showFullscreenResults = useMemo(
    () => new URLSearchParams(searchParamsString).get("fullscreen") === "1",
    [searchParamsString]
  );
  const imageParam = useMemo(
    () => new URLSearchParams(searchParamsString).get("image"),
    [searchParamsString]
  );

  const setSearchParams = useCallback(
    (params: Record<string, string | string[] | boolean | undefined>) => {
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
      router.push(`?${sp.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Search
        selectedCategories={selectedCategories}
        selectedKeywords={selectedKeywords}
        selectedYears={selectedYears}
        showAnnotatedOnly={showAnnotatedOnly}
        showFullscreenResults={showFullscreenResults}
        imageParam={imageParam}
        searchParamsString={searchParamsString}
        setSearchParams={setSearchParams}
      />
    </QueryClientProvider>
  );
}
