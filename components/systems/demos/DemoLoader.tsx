"use client";

import dynamic from "next/dynamic";

/** Code-split demo loader so a route only ships the demos it shows. */
const DEMOS: Record<string, React.ComponentType> = {
  "code-review-arena": dynamic(() => import("./CodeReviewArenaDemo"), {
    loading: () => <DemoSkeleton />,
  }),
  "helm-browser-agent": dynamic(() => import("./HelmDemo"), {
    loading: () => <DemoSkeleton />,
  }),
  debugbrief: dynamic(() => import("./DebugBriefDemo"), {
    loading: () => <DemoSkeleton />,
  }),
  contamcheckr: dynamic(() => import("./ContamCheckrDemo"), {
    loading: () => <DemoSkeleton />,
  }),
};

function DemoSkeleton() {
  return (
    <div className="plate grid min-h-[20rem] place-items-center p-8">
      <p className="kicker">Loading demonstration…</p>
    </div>
  );
}

export default function DemoLoader({ slug }: { slug: string }) {
  const Demo = DEMOS[slug];
  if (!Demo) return null;
  return <Demo />;
}
