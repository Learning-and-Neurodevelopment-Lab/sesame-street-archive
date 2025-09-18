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
import FadeInImage from "@/components/FadeInImage";

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

      // S48-E4831_00071
      // S48-E4831_00655
      // S48-E4829_00131
      // S48-E4831_01156
      // S36-E4086_02183

      const { data } = await client.models.Image.list({
        filter: {
          or: [
            { image_id: "00751", episode_id: "4274", season: 42 },
            { image_id: "00071", episode_id: "4831", season: 48 },
            { image_id: "00655", episode_id: "4831", season: 48 },
            { image_id: "00131", episode_id: "4829", season: 48 },
            { image_id: "01156", episode_id: "4831", season: 48 },
            { image_id: "00222", episode_id: "4829", season: 48 },
          ].map(({ image_id, episode_id, season }) => ({
            image_id: { eq: image_id },
            episode_id: { eq: episode_id },
            season: { eq: season },
          })),
        } as any,
      });
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: isAuthenticated,
  });

  const imageIds = useMemo(
    () =>
      images.map((img) => ({
        image_id: { eq: concatenateImageIdForFiltering(img) },
      })),
    [images]
  );

  const { data: annotations = [], isLoading: annotationsLoading } = useQuery({
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
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: isAuthenticated && images.length > 0,
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
    <div className="grid min-h-screen bg-gray-50 flex-wrap sm:grid-cols-[auto_1fr] max-w-8xl">
      {/* Aside Navigation */}
      <aside className="w-full sm:w-64 bg-white border-r border-gray-200 flex flex-col py-8 px-6">
        <h2 className="text-xl font-medium mb-8">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link
            href="#"
            className="py-1 font-normal text-gray-800  cursor-pointer"
          >
            Collections
          </Link>
          <span className="py-1 text-gray-400 cursor-not-allowed">
            Contributions
          </span>
          <span className="py-1 text-gray-400 cursor-not-allowed">
            Scoreboard
          </span>
          <span className="py-1 text-gray-400 cursor-not-allowed">
            Suggested
          </span>
          <span className="py-1 text-gray-400 cursor-not-allowed">
            Notifications
          </span>
          <span className="py-1 text-gray-400 cursor-not-allowed">Account</span>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 py-4 px-4 justify-self-center">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="mb-8">
            <h1 className="text-2xl font-medium mb-4">Annotation Collection</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {imagesWithAnnotations.map((result) => {
              const imgUrl = imageUrls[result.id] || "";
              return (
                <Link
                  href={`/annotate?image=${encodeURIComponent(imgUrl)}`}
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
                    <div className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded transition">
                      Annotate
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
