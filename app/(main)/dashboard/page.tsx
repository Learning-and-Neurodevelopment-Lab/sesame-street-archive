import React, { Suspense } from "react";
import { connection } from 'next/server';
import DashboardContainer from "./DashboardContainer";

export default async function DashboardPage() {
   await connection();

  return (
    <Suspense fallback={<>...</>}>
      <DashboardContainer />
    </Suspense>
  );
}
