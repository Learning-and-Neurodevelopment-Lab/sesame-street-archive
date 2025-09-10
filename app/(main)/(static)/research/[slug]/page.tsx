import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getResearchArticle, getRelatedArticles, getAllResearchIds } from '@/lib/research-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const ids = getAllResearchIds();
  return ids.map((id) => ({
    slug: id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getResearchArticle(slug);
  
  if (!article) {
    return {
      title: 'Research Article Not Found',
    };
  }

  return {
    title: `${article.title} | Sesame Street Archive Research`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishDate,
      authors: article.authors,
      tags: article.tags,
    },
  };
}
 
const components = {
  h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{children}</h1>,
  h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-4">{children}</h2>,
  h4: ({ children }) => <h4 className="text-xl text-gray-600 mb-6">{children}</h4>,
}

export default async function ResearchArticlePage({ params }: { params: Promise<{ locale: string, slug: string }> }) {
  const { locale = 'en', slug } = await params;
  
  try {
    const Content = (await import(`@/markdown/research/${slug}/${locale}.mdx`)).default;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
       <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
         <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
         <span>/</span>
         <Link href="/research" className="hover:text-gray-900 transition-colors">Research</Link>
         <span>/</span>
         <span className="text-gray-900">{slug}</span>
       </nav>
        <Content components={components} authors={['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez']} />
      </div>
    );
  } catch (error) {
    console.log('ERROR', error);
    return notFound();
  }

  // const relatedArticles = getRelatedArticles(article.id, article.content.relatedWork);

  // return (
  //   <div className="max-w-4xl mx-auto px-4 py-12">
  //     {/* Breadcrumb */}
  //     <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
  //       <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
  //       <span>/</span>
  //       <Link href="/research" className="hover:text-gray-900 transition-colors">Research</Link>
  //       <span>/</span>
  //       <span className="text-gray-900">{article.title}</span>
  //     </nav>

  //     <header className="mb-12">
  //       <div className="mb-6">
  //         <span className={`inline-block px-3 py-1 text-xs font-semibold ${article.category.color} ${article.category.bgColor} rounded-full mb-4`}>
  //           {article.category.name}
  //         </span>
  //         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
  //           {article.title}
  //         </h1>
  //         <p className="text-xl text-gray-600 mb-6">
  //           {article.subtitle}
  //         </p>
  //       </div>

  //       <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
  //         <span>{new Date(article.publishDate).toLocaleDateString('en-US', { 
  //           year: 'numeric', 
  //           month: 'long', 
  //           day: 'numeric' 
  //         })}</span>
  //         <span>{article.readTime}</span>
  //         <span>By {article.authors.join(', ')}</span>
  //       </div>

  //       <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
  //         <Image 
  //           src={article.image} 
  //           alt={article.title}
  //           className="w-full h-full object-cover"
  //           priority
  //         />
  //       </div>

  //       <div className="flex flex-wrap gap-2">
  //         {article.tags.map((tag) => (
  //           <span 
  //             key={tag}
  //             className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
  //           >
  //             {tag}
  //           </span>
  //         ))}
  //       </div>
  //     </header>

  //     <article className="prose prose-lg max-w-none">
  //       <section className="mb-12">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
  //         <p className="text-gray-700 leading-relaxed">
  //           {article.content.overview}
  //         </p>
  //       </section>

  //       <section className="mb-12">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Methodology</h2>
  //         <p className="text-gray-700 leading-relaxed">
  //           {article.content.methodology}
  //         </p>
  //       </section>

  //       <section className="mb-12">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Findings</h2>
  //         <ul className="space-y-3">
  //           {article.content.findings.map((finding, index) => (
  //             <li key={index} className="flex items-start gap-3">
  //               <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
  //               <span className="text-gray-700">{finding}</span>
  //             </li>
  //           ))}
  //         </ul>
  //       </section>

  //       <section className="mb-12">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-4">Implications</h2>
  //         <p className="text-gray-700 leading-relaxed">
  //           {article.content.implications}
  //         </p>
  //       </section>

  //       {article.references && article.references.length > 0 && (
  //         <section className="mb-12">
  //           <h2 className="text-2xl font-bold text-gray-900 mb-4">References</h2>
  //           <div className="space-y-3">
  //             {article.references.map((ref, index) => (
  //               <div key={index} className="p-4 bg-gray-50 rounded-lg">
  //                 <p className="text-sm text-gray-700">
  //                   <strong>{ref.authors}</strong> ({ref.year}). {ref.title}. 
  //                   <em> {ref.journal}</em>.
  //                   {ref.doi && (
  //                     <span className="ml-2 text-blue-600">
  //                       DOI: {ref.doi}
  //                     </span>
  //                   )}
  //                 </p>
  //               </div>
  //             ))}
  //           </div>
  //         </section>
  //       )}
  //     </article>

  //     {relatedArticles.length > 0 && (
  //       <section className="mt-16 pt-12 border-t border-gray-200">
  //         <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Research</h2>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {relatedArticles.map((relatedArticle) => (
  //             <article key={relatedArticle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
  //               <div className="aspect-video bg-gray-200">
  //                 <Image 
  //                   src={relatedArticle.image} 
  //                   alt={relatedArticle.title}
  //                   className="w-full h-full object-cover"
  //                 />
  //               </div>
  //               <div className="p-6">
  //                 <span className={`inline-block px-3 py-1 text-xs font-semibold ${relatedArticle.category.color} ${relatedArticle.category.bgColor} rounded-full mb-3`}>
  //                   {relatedArticle.category.name}
  //                 </span>
  //                 <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
  //                   {relatedArticle.title}
  //                 </h3>
  //                 <p className="text-gray-600 text-sm mb-4 line-clamp-3">
  //                   {relatedArticle.excerpt}
  //                 </p>
  //                 <Link 
  //                   href={`/research/${relatedArticle.id}`}
  //                   className="text-blue-600 text-sm font-medium hover:underline"
  //                 >
  //                   Read more →
  //                 </Link>
  //               </div>
  //             </article>
  //           ))}
  //         </div>
  //       </section>
  //     )}

  //     <section className="mt-16 pt-12 border-t border-gray-200 text-center">
  //       <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //         Interested in Our Research?
  //       </h2>
  //       <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
  //         Join our research community and stay updated on the latest findings in educational media and child development.
  //       </p>
  //       <div className="flex gap-4 justify-center">
  //         <Button asChild>
  //           <Link href="/contact">Get Involved</Link>
  //         </Button>
  //         <Button asChild variant="outline">
  //           <Link href="/research">View All Research</Link>
  //         </Button>
  //       </div>
  //     </section>
  //   </div>
  // );
}