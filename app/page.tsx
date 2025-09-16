// app/page.tsx
import Navigation from '@/components/Navigation';
import MainPage from './(main)/page';

export default function HomePage() {
  // Add any homepage-specific logic here if needed
  return <>
    <Navigation />
    <MainPage />
  </>;
}

// Re-export any other exports from the main page
export * from './(main)/page';
