# Sesame Street Archive & Annotation Tool

This application is a collaborative research and annotation platform for educational media, built with Next.js, AWS Amplify, and MDX. It enables researchers, educators, and the community to:

- Browse and annotate educational media assets
- Collaborate on research articles and guides
- Explore research findings and guides in multiple languages
- Manage and contribute to a growing archive of annotated content

## Key Features

- **MDX-based Research Articles:**
  - All research articles and guides are written in MDX and stored in the `/markdown` directory.
  - Articles support rich metadata, custom components, and localization.
- **Annotation Tools:**
  - Annotate images and media assets for research and educational purposes.
- **Collaboration:**
  - Multi-user support for collaborative research and annotation.
- **Modern UI:**
  - Built with Next.js, Tailwind CSS, and a component-driven design.

## Directory Structure

- `/app` — Main Next.js application code (pages, routes, components)
- `/components` — Shared React components
- `/markdown` — All research articles and guides in MDX format
- `/public` — Static assets (images, etc.)

## Editing or Adding Research Articles

See the [markdown/README.md](./markdown/README.md) for detailed instructions on how to add or update MDX research documents.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Pull requests and contributions are welcome! Please see the markdown/README.md for content guidelines.

---

For more information on editing MDX research articles, see [markdown/README.md](./markdown/README.md).
