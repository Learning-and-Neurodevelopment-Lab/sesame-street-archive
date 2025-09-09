import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import ResearchFilterSort from './ResearchFilterSort';
import one from '@/assets/annotated-examples/03212.png';
import two from '@/assets/annotated-examples/S35-E4057_01283.png';
import three from '@/assets/annotated-examples/S35-E4058_00212.png';
import four from '@/assets/annotated-examples/S35-E4058_00332.png';

export default function ResearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Research & Publications
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Our interdisciplinary research combines neuroscience, computer vision, and educational psychology to understand how children learn from media content.
        </p>
      </div>

      {/* Featured Research */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Research</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Primary Featured Study */}
          <article className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <Image src={one} alt="Brain imaging study" className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
                Featured Study
              </span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Vision, Hands, Sesame 2026 Hackathon
              </h3>
              <p className="text-gray-600 mb-6">
                A groundbreaking collaborative initiative bringing together researchers, developers, and educators to advance computer vision applications in children's media analysis. This hackathon focuses on developing innovative tools for understanding how visual elements in educational content impact child development.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/research/hackathon-2026">Read Full Study</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/research/hackathon-2026/participate">Join Hackathon</Link>
                </Button>
              </div>
            </div>
          </article>

          {/* Secondary Featured */}
          <article className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <Image src={two} alt="AI analysis" className="w-full h-full object-cover" />
            </div>
            <div className="p-8">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full mb-4">
                Latest Publication
              </span>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                AI-Powered Content Analysis Framework
              </h3>
              <p className="text-gray-600 mb-6">
                Machine learning models trained on 4,000+ annotated images help researchers automatically identify educational content patterns, character interactions, and learning moments in children's television programming.
              </p>
              <Button asChild>
                <Link href="/research/ai-analysis">Read Publication</Link>
              </Button>
            </div>
          </article>
        </div>
      </section>

      {/* Research Areas */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Research Areas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Neuroscience */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Neuroscience & Brain Imaging</h3>
            <p className="text-gray-600 text-sm mb-4">
              fMRI studies examining how children's brains respond to educational media content, character recognition, and visual learning patterns.
            </p>
            <Link href="/research/neuroscience" className="text-blue-600 text-sm font-medium hover:underline">
              Explore Studies →
            </Link>
          </div>

          {/* Computer Vision */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Computer Vision & ML</h3>
            <p className="text-gray-600 text-sm mb-4">
              Advanced machine learning models for automated detection of faces, places, numbers, and educational content in video frames.
            </p>
            <Link href="/research/computer-vision" className="text-blue-600 text-sm font-medium hover:underline">
              View Models →
            </Link>
          </div>

          {/* Educational Psychology */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Educational Psychology</h3>
            <p className="text-gray-600 text-sm mb-4">
              Understanding how visual narratives and character interactions influence learning outcomes in preschool and elementary education.
            </p>
            <Link href="/research/educational-psychology" className="text-blue-600 text-sm font-medium hover:underline">
              Read Findings →
            </Link>
          </div>
        </div>
      </section>

      {/* All Research Articles (Interactive) */}
      <section className="mb-16">
        <ResearchFilterSort />
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/research/archive">View Research Archive</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Collaborate with Our Research Team
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our interdisciplinary research community and contribute to advancing our understanding of how children learn from media content.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/contact">Get Involved</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/explore">Explore Dataset</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}