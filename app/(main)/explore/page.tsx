import React, { Suspense } from "react";
import { connection } from 'next/server';
import SearchContainer from "./SearchContainer";

export default async function ExplorePage() {
  await connection();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Suspense fallback={<>...</>}>
        <SearchContainer />
      </Suspense>
    </div>
  );
}
