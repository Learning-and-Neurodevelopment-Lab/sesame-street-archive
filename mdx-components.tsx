 import type { MDXComponents } from 'mdx/types';
 import Image from 'next/image';
 import { format } from 'date-fns';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Header: ({ children }) => <header className="mb-8">{children}</header>,
    h1: ({ children }) => <h1 className="text-4xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold">{children}</h4>,
    p: ({ children }) => <p className="text-lg">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 my-4 text-neutral-700">{children}</ul>,
    li: ({ children }) => (
      <li className="flex items-start gap-3">
        <span className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
        <span className="text-gray-700">{children}</span>
      </li>
    ),
    Section: ({ children, id }) => <section className="mb-8 scroll-m-20" id={id}>{children}</section>,
    GriddedSection: ({ children }) => <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">{children}</section>,
    Person: ({ children: [name, title, affliation] }) => (
      <div className="mb-4">
        <span className="font-medium">{name}</span><br />
        <span className="text-gray-600 text-sm">{title}</span>
        {!!affliation && <><br /><span className="text-gray-400 text-sm">{affliation}</span></>}
      </div>
    ),
    Category: ({ children, color }) => (
      <span className={`inline-block px-3 py-1 text-xs font-semibold text-${color}-600 bg-${color}-100 rounded-full mb-4`}>
        {children}
      </span>
    ),
    Tags: ({ items = [] }) => (
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">{item}</span>
        ))}
      </div>
    ),
    Meta: ({ date, readingTime, authors = [] }) => (
      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
        {date && <span>{format(new Date(date), 'MMM dd, yyyy')}</span>}
        {readingTime && <span>{readingTime} min read</span>}
        {authors.length > 0 && <span>By {authors.join(', ')}</span>}
      </div>
    ),
    Image: ({ src, alt }) => (
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-8">
        <Image src={src} alt={alt} width={1440} height={1440} className="w-full h-auto" />
      </div>
    ),
    Article: ({ children }) => <article className="prose prose-lg max-w-none">{children}</article>,
  };
}