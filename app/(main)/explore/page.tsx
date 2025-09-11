import React, { Suspense } from "react";
import { connection } from 'next/server';
import Search from "./Search";

export default async function ExplorePage() {
  await connection();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <Suspense fallback={<>...</>}>
          <Search />
        </Suspense>
      </div>
  );
}
