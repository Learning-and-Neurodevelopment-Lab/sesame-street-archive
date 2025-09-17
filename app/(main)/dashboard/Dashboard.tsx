"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { useQuery, useQueries } from "@tanstack/react-query";
import { PulseLoader } from "react-loadly";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { getUrl } from "aws-amplify/storage";
import { FadeInImage } from "../explore/Search";
import { set } from "date-fns";

interface ImageForFiltering {
  season: string | number;
  episode_id: string | number;
  image_id: string | number;
}

type ImageUrlMap = Record<string, string>;

const client = generateClient<Schema>();

const concatenateImageIdForFiltering = (image: ImageForFiltering): string =>
  `S${image.season}-E${image.episode_id}_${image.image_id}.png`;

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          router.push("/auth/signin");
        }

        setIsAuthenticated(!!user);
      } catch {
        router.push("/auth/signin");
      }
    };
    checkAuth();
  }, []);

  const { data: images = [], isLoading: imagesLoading } = useQuery({
    queryKey: ["dashboard-images", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      const { data } = await client.models.Image.list({
        filter: {
          or: [
            { image_id: "00751", episode_id: "4274", season: 42 },
            { image_id: "00071", episode_id: "4831", season: 48 },
            { image_id: "01156", episode_id: "4831", season: 48 },
            { image_id: "00469", episode_id: "4817", season: 48 },
            { image_id: "00266", episode_id: "4109", season: 48 },
            { image_id: "00344", episode_id: "4605", season: 48 },
          ].map(({ image_id, episode_id }) => ({
            image_id: { eq: image_id },
            episode_id: { eq: episode_id },
          })),
        } as any,
        limit: 6,
      });
      return data || [];
    },
    staleTime: 1000 * 60 * 1,
  });

  const imageIds = useMemo(
    () =>
      images.map((img) => ({
        image_id: { eq: concatenateImageIdForFiltering(img) },
      })),
    [images]
  );

  const { data: annotations, isLoading: annotationsLoading } = useQuery({
    queryKey: ["dashboard-annotations", isAuthenticated],
    queryFn: async () => {
      if (!isAuthenticated) return [];

      const { data } = await client.models.Annotation.list({
        filter: {
          or: imageIds,
        } as any,
        limit: 1000000,
      });
      return data || [];
    },
    staleTime: 1000 * 60 * 60,
  });

  let imagesWithAnnotations = [];

  if (!imagesLoading && !annotationsLoading) {
    const concatenateImageIdForFiltering = (image: ImageForFiltering): string =>
      `S${image.season}-E${image.episode_id}_${image.image_id}.png`;

    imagesWithAnnotations = images.map((image) => {
      const data =
        annotations?.filter((a) => {
          return a.image_id === concatenateImageIdForFiltering(image);
        }) || [];
      const imagePath = concatenateImageIdForFiltering(image);
      const annotationItems = data.map((a) => {
        let polygon: any[] = [];
        if (typeof a.polygon === "string") {
          try {
            const parsed = JSON.parse(a.polygon);
            polygon = Array.isArray(parsed) ? parsed : [];
          } catch {
            polygon = [];
          }
        } else if (Array.isArray(a.polygon)) {
          polygon = a.polygon;
        }
        return {
          category: a.category ?? "",
          keywords: a.keywords ? a.keywords.split(" ") : [],
          polygon,
          annotationId: a.annotation_id,
        };
      });

      const filename = image.image_id ?? imagePath;
      const yearStr = image.air_year ? String(image.air_year) : "";
      return {
        id: String(image.image_id).padStart(5, "0") || 0,
        filename,
        categories: Array.from(
          new Set(data.map((annotation) => annotation.category))
        ),
        annotations: annotationItems,
        imagePath,
        hasAnnotations: data.length > 0,
        episode: String(image.episode_id),
        episodeTitle: image.episode_title || "",
        year: yearStr,
      };
    });
  }

  const imageUrlQueries = useQueries({
    queries:
      imagesWithAnnotations.map((r) => ({
        queryKey: ["imageUrl", r.imagePath],
        queryFn: async () => {
          const urlObj = await getUrl({ path: `images/${r.imagePath}` });
          return urlObj.url.href;
        },
        enabled: !!r.imagePath,
        staleTime: 1000 * 60 * 10,
      })) || [],
  });

  const imageUrls = useMemo(() => {
    const newUrls: ImageUrlMap = {};
    imagesWithAnnotations.forEach((r, idx) => {
      newUrls[r.id] = imageUrlQueries[idx]?.data || "";
    });
    return newUrls;
  }, [imageUrlQueries, imagesWithAnnotations]);

  if (!isAuthenticated) return null;

  if (annotationsLoading || imagesLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
        <PulseLoader color="#364153" size={60} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {imagesWithAnnotations.map((result) => {
          const imgUrl = imageUrls[result.id] || "";
          return (
            <div
              key={result.imagePath}
              className="rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow bg-white flex flex-col items-center"
            >
              {imgUrl ? (
                <FadeInImage
                  key={`${result.id}-${result.episode}-image`}
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
                  <PulseLoader color="#9ca3af" size={8} />
                </div>
              )}
              <div className="p-4 w-full flex justify-center">
                <Link
                  href={`/annotate?image=${encodeURIComponent(imgUrl)}`}
                  className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition"
                >
                  Annotate
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
