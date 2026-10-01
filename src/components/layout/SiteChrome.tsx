import { ViewTransition, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { DemoPill } from "./DemoPill";
import type { Biz } from "@/lib/biz-core";

/** Header, the page, footer, the phone bar and the demo pill. Client parts read the business from BizProvider. */
export function SiteChrome({ children, biz }: { children: ReactNode; biz?: Biz }) {
  return (
    <>
      <Header />
      <ViewTransition default="page-swap">
        <main id="main">{children}</main>
      </ViewTransition>
      <Footer biz={biz} />
      <MobileBar />
      <DemoPill />
    </>
  );
}
