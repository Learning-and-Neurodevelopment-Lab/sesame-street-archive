// app/page.tsx
import MainPage from './(main)/page';

export default function HomePage() {
  // Add any homepage-specific logic here if needed
  return <MainPage />;
}

// Re-export any other exports from the main page
export * from './(main)/page';
