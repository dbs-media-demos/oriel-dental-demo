import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { BizProvider } from "@/components/preview/BizContext";
import { PreviewGuard } from "@/components/preview/PreviewGuard";
import { Translate, translateGateCss } from "@/components/preview/Translate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { previewBiz } from "@/lib/preview";
import { sr } from "@/i18n/sr";

/**
 * A personalised preview made in the Scale by Noon CRM: this demo's homepage with a real
 * business's name, phone, address, hours and rating, in its language. The token is the key;
 * removing the demo in the CRM makes the page 404.
 */
export default async function PreviewLayout({ children, params }: { children: ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  const biz = await previewBiz(token);
  if (!biz) notFound();
  return (
    <BizProvider biz={biz}>
      {biz.lang === "sr" && (
        <>
          <style>{translateGateCss}</style>
          <Translate dict={sr} />
        </>
      )}
      <SiteChrome biz={biz}>{children}</SiteChrome>
      <PreviewGuard />
    </BizProvider>
  );
}
