"use client";
import { useState, useMemo } from "react";
import { SearchableCombobox } from "@/components/SearchableCombobox";
import Image from "next/image";
import Link from "next/link";

export default function RelatedResearchSection({ relatedArticles }) {
  // Get all unique topics
  const allTopics = useMemo(() => Array.from(new Set(relatedArticles.map(a => String(a.category.name)))), [relatedArticles]);
  const topicOptions = useMemo(() => allTopics.map(topic => ({ value: String(topic), label: String(topic) })), [allTopics]);
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const filteredRelated = useMemo(() => {
    let filtered = relatedArticles;
    if (selectedTopic) {
      filtered = filtered.filter(a => a.category.name === selectedTopic);
    }
    filtered = filtered.slice().sort((a, b) => {
      if (sortOrder === "desc") {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      } else {
        return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
      }
    });
    return filtered;
  }, [relatedArticles, selectedTopic, sortOrder]);

  if (!relatedArticles || relatedArticles.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Research</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex-1">
          <SearchableCombobox
            options={topicOptions}
            value={selectedTopic}
            onChange={val => setSelectedTopic(typeof val === "string" ? val : (val[0] || ""))}
            placeholder="Filter by topic..."
            className="w-full md:w-64"
          />
        </div>
        <div>
          <label className="mr-2 text-sm text-gray-700">Sort by date:</label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as "desc" | "asc")}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRelated.map((relatedArticle) => (
          <article key={relatedArticle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200">
              <Image 
                src={relatedArticle.image} 
                alt={relatedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <span className={`inline-block px-3 py-1 text-xs font-semibold ${relatedArticle.category.color} ${relatedArticle.category.bgColor} rounded-full mb-3`}>
                {relatedArticle.category.name}
              </span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {relatedArticle.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {relatedArticle.excerpt}
              </p>
              <Link 
                href={`/research/${relatedArticle.id}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
