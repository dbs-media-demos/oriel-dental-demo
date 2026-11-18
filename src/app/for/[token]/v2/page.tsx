import { notFound } from "next/navigation";
import { HomeContent } from "@/components/sections/HomeContent";
import { previewBiz } from "@/lib/preview";

export { generateMetadata } from "../page";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

/** The personalised preview without 3D: /for/<token> with the charted-arch hero (HomeContent, hero="2d"). */
export default async function PreviewPageV2({ params }: { params: Promise<{ token: string }> }) {
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeContent biz={biz} hero="2d" />;
}
