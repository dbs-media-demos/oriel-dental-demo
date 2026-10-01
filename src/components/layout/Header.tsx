"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { Button, PhoneIcon } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { mainNav } from "@/content/site";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";

export function Header() {
  const biz = useBiz();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const lastY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes (derived during render, no effect needed).
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 480) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
    <header
      style={{ viewTransitionName: "site-header" }}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-soft)]",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled && !open ? "bg-porcelain/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 text-ink">
          <Logo />
          <span className="sr-only">, home</span>
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "relative rounded-full px-3.5 py-2 text-[0.92rem] font-medium transition-colors duration-500",
                    isActive(item.href) ? "bg-mist-soft text-ink" : "text-ink/75 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-2 sm:gap-3">
          <a href={telOf(biz)} className="hidden items-center gap-2 px-2 text-[0.92rem] font-semibold text-ink lg:inline-flex">
            <PhoneIcon />
            {biz.phoneDisplay}
          </a>
          <Button href="/book" className="hidden !min-h-11 !px-5 sm:inline-flex">
            Book a visit
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((o) => !o);
            }}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-12 place-items-center rounded-full bg-shell/80 ring-1 ring-line backdrop-blur xl:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-ink transition-all duration-500", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={clsx("absolute left-0 h-[1.5px] w-5 bg-ink transition-all duration-500", open ? "top-1.5 -rotate-45" : "top-3")} />
            </span>
          </button>
        </div>
      </div>
    </header>

      {/* Mobile / tablet menu: a sibling of the header, so the header's transform can't trap it. */}
      <div
        id="site-menu"
        ref={menuRef}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-porcelain pt-[calc(var(--header-h)+1rem)] xl:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto">
          <ul className="border-t border-line">
            {[{ label: "Home", href: "/" }, ...mainNav, { label: "Reviews", href: "/reviews" }, { label: "Contact", href: "/contact" }].map((item, i) => (
              <li key={item.href} className="border-b border-line" style={{ animation: `fade-in 1s var(--ease-soft) ${0.05 * i}s both` }}>
                <Link href={item.href} className="display flex items-center justify-between py-4 text-[2rem]">
                  {item.label}
                  <span aria-hidden className="text-base text-sage">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3 pb-32 text-ink-soft">
            <OpenBadge />
            <p>{biz.address.full}</p>
            <a href={telOf(biz)} className="block text-lg font-semibold text-ink">
              {biz.phoneDisplay}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
