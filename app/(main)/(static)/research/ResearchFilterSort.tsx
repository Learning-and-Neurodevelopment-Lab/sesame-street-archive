"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { SearchableCombobox } from "@/components/SearchableCombobox";
import Image from "next/image";
import Link from "next/link";
import one from '@/app/(main)/assets/annotated-examples/03212.png';
import two from '@/app/(main)/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/app/(main)/assets/annotated-examples/S35-E4058_00212.png';
import four from '@/app/(main)/assets/annotated-examples/S35-E4058_00332.png';

const articles = [
  {
    id: 1,
    title: "Cross-University Research Initiative",
    category: "Collaboration",
    categoryColor: "text-purple-600 bg-purple-100",
    date: "2024-12-01",
    link: "/research/collaboration",
    image: three,
    summary: "Five leading research institutions collaborate to create the largest annotated dataset of children's educational media.",
    tag: "Collaboration",
    tagColor: "text-purple-600 bg-purple-100",
    dateLabel: "Dec 2024"
  },
  {
    id: 2,
    title: "Learning Through Visual Narratives",
    category: "Education",
    categoryColor: "text-orange-600 bg-orange-100",
    date: "2024-11-01",
    link: "/research/visual-learning",
    image: four,
    summary: "Research shows how specific visual elements in Sesame Street episodes enhance number recognition and mathematical thinking.",
    tag: "Education",
    tagColor: "text-orange-600 bg-orange-100",
    dateLabel: "Nov 2024"
  },
  {
    id: 3,
    title: "Open-Source Annotation Tools",
    category: "Methodology",
    categoryColor: "text-red-600 bg-red-100",
    date: "2024-10-01",
    link: "/research/annotation-tools",
    image: two,
    summary: "Web-based annotation platform enables researchers worldwide to contribute to standardized media analysis tools.",
    tag: "Methodology",
    tagColor: "text-red-600 bg-red-100",
    dateLabel: "Oct 2024"
  },
  {
    id: 4,
    title: "Character Recognition in Developing Brains",
    category: "Neuroscience",
    categoryColor: "text-blue-600 bg-blue-100",
    date: "2024-09-01",
    link: "/research/character-recognition",
    image: one,
    summary: "fMRI studies reveal how children's brains process familiar characters, providing insights into social cognition development.",
    tag: "Neuroscience",
    tagColor: "text-blue-600 bg-blue-100",
    dateLabel: "Sep 2024"
  },
  {
    id: 5,
    title: "Next Generation Media Studies",
    category: "Future Work",
    categoryColor: "text-indigo-600 bg-indigo-100",
    date: "2024-08-01",
    link: "/research/future-directions",
    image: three,
    summary: "Exploring how emerging technologies like VR and interactive media can be analyzed using our frameworks.",
    tag: "Future Work",
    tagColor: "text-indigo-600 bg-indigo-100",
    dateLabel: "Aug 2024"
  },
  {
    id: 6,
    title: "Large-Scale Annotation Dataset",
    category: "Dataset",
    categoryColor: "text-green-600 bg-green-100",
    date: "2024-07-01",
    link: "/research/dataset",
    image: four,
    summary: "Comprehensive dataset with 4,000+ manually annotated images for training computer vision models.",
    tag: "Dataset",
    tagColor: "text-green-600 bg-green-100",
    dateLabel: "Jul 2024"
  }
];

export default function ResearchFilterSort() {
  // State for topic filter, sort type, and sort order
  const [selectedTopic, setSelectedTopic] = useState("");
  const [sortType, setSortType] = useState<'date' | 'title'>("date");
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>("desc");

  // Compute unique topic options from articles
  const topicOptions = useMemo(() => {
    const unique = Array.from(new Set(articles.map(a => a.category)));
    return unique.map(topic => ({ label: topic, value: topic }));
  }, []);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    let filtered = selectedTopic
      ? articles.filter(a => a.category === selectedTopic)
      : articles;
    filtered = [...filtered].sort((a, b) => {
      if (sortType === "date") {
        const cmp = a.date.localeCompare(b.date);
        return sortOrder === "desc" ? -cmp : cmp;
      } else {
        const cmp = a.title.localeCompare(b.title);
        return sortOrder === "desc" ? -cmp : cmp;
      }
    });
    return filtered;
  }, [selectedTopic, sortType, sortOrder]);

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row md:relative md:items-center justify-between mb-8 gap-4">
        <div className="flex-1">
          <div className="md:absolute md:inset-y-0 md:left-0">
            <SearchableCombobox
              options={topicOptions}
              value={selectedTopic}
              onChange={val => setSelectedTopic(typeof val === "string" ? val : (val[0] || ""))}
              placeholder="Filter by topic..."
              className="w-full md:w-64"
            />
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-700">Sort by:</label>
          <select
            value={sortType}
            onChange={e => setSortType(e.target.value as 'date' | 'title')}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
          {selectedTopic && (
            <Button size="sm" variant="ghost" onClick={() => setSelectedTopic("")}>Clear Filter</Button>
          )}
        </div>
      </div>
      {selectedTopic && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
            Showing category: {selectedTopic}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <article key={article.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gray-200">
              <Image src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <span className={`inline-block px-3 py-1 text-xs font-semibold ${article.tagColor} rounded-full mb-3`}>
                {article.tag}
              </span>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {article.summary}
              </p>
              <div className="flex justify-between items-center">
                <Link href={article.link} className="text-blue-600 text-sm font-medium hover:underline">
                  Read More →
                </Link>
                <span className="text-xs text-gray-500">{article.dateLabel}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
