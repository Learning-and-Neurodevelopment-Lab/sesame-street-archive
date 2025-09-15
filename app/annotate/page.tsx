'use client';

import { Suspense } from "react";
import Tool from "./Tool";
import { PulseLoader } from "react-loadly";
import "react-loadly/styles.css";


function ToolLoading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 w-full h-full flex flex-col items-center justify-center">
          <PulseLoader color="#ff6b6b" size={60} />
        </p>
      </div>
    </div>
  );
}

export default function AnnotatePage() {
  return (
    <div className="w-full h-full flex flex-col">
      <Suspense fallback={<ToolLoading />}>
        <Tool />
      </Suspense>
    </div>
  );
}