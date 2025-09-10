# Editing and Adding MDX Research Documents

## Where are the MDX files?

All research articles are stored as MDX files in the `/markdown/research/` directory. Each article has its own folder, and each language/locale version is a separate `.mdx` file. For example:

```
/markdown/research/
  collaboration/
    en.mdx
  ai-analysis/
    en.mdx
  character-recognition/
    en.mdx
```

## MDX File Structure

Each MDX file should export a `metadata` object at the top, for example:

```mdx
export const metadata = {
  title: "Cross-University Research Initiative",
  description: "This guide will help you understand how to participate in the archive's collaborative features.",
  category: "Collaboration",
  authors: ["Jane Doe", "John Smith"],
  tags: ["collaboration", "community", "annotations"],
  date: "2024-01-01",
  heroImage: "/images/placeholder1.jpg",
};
```

You can then use the metadata in your MDX content.

## How are MDX files loaded?

- The app dynamically imports the correct MDX file based on the URL slug and locale.
- The metadata is used for SEO, OpenGraph, and page headers.
- The MDX content is rendered as the main article body.

## How to add a new research article

1. **Create a new folder** in `/markdown/research/` with your article’s slug (e.g., `my-new-article`).
2. **Add an MDX file** for each language you want to support (e.g., `en.mdx`).
3. **Export a `metadata` object** at the top of your MDX file.
4. **Write your article** using Markdown and MDX components.

## How to update an existing article

- Edit the appropriate `.mdx` file in `/markdown/research/[slug]/[locale].mdx`.
- Update the `metadata` object as needed.
- Save your changes and the app will automatically pick up the updates.

## Adding Custom Components

You can use custom React components in your MDX files, as long as they are registered in the MDX provider in the app.

## Example

```mdx
export const metadata = {
  title: "My Research Article",
  // ...other fields
};

<Header>
  <Category color="blue">{metadata.category}</Category>
  # {metadata.title}
  <Meta authors={metadata.authors} date={metadata.date} />
  <Image src={metadata.heroImage} />
  <Tags items={metadata.tags} />
</Header>
<Article>
  {/* Your content here */}
</Article>
```
