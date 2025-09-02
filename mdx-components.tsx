 import type { MDXComponents } from 'mdx/types';

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
    Section: ({ children, id }) => <section className="mb-8 scroll-m-20" id={id}>{children}</section>,
    GriddedSection: ({ children }) => <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">{children}</section>,
    Person: ({ children: [name, title] }) => (
      <div className="mb-4">
        <span className="font-medium">{name}</span> <br />
        <span className="text-gray-600 tex-sm">{title}</span>
      </div>
    )
  };
}