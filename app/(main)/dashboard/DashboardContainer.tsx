"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from "react";
import Dashboard from "./Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, 
      gcTime: 0,
      retry: 1,
    },
  }
});

export default function DashboardContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}