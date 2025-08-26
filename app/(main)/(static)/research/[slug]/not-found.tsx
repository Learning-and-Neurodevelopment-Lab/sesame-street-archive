// app/(main)/(static)/research/[slug]/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ResearchNotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Research Article Not Found
      </h1>
      <p className="text-gray-600 mb-8">
        The research article you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild>
          <Link href="/research">View All Research</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}