"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Download, FileText, ChevronUp, ChevronDown, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

// Memoized PDF Page Component for smooth rendering
const MemoizedPDFPage = React.memo(({ url, page }: { url: string; page: number }) => {
  return (
    <div className="flex-[0_0_100%] h-full w-full relative overflow-hidden">
      <style jsx>{`
        iframe::-webkit-scrollbar {
          display: none;
        }
        iframe {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <iframe
        id={`pdf-page-${page}`}
        src={`${url}#page=${page}&view=Fit&scrollbar=0&toolbar=0&navpanes=0`}
        className="w-full h-full border-none pointer-events-auto"
        title={`Business Plan - Page ${page}`}
        loading="lazy"
        scrolling="no"
      />
    </div>
  );
});


MemoizedPDFPage.displayName = "MemoizedPDFPage";

export default function BusinessValuePage() {
  const [currentPage, setCurrentPage] = useState(0); // Embla uses 0-based index
  const pdfUrl = useMemo(() => "/HikeMove_compressed.pdf", []);

  // Initialize Embla with vertical orientation and smooth scrolling
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    skipSnaps: false,
    duration: 30, // Smooth duration
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrentPage(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "HikeMove_Business_Plan.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfUrl]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // We show 12 pages as a standard for business plans, or as many as the user scrolls
  const pages = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 1), []);

  return (
    <div className="relative h-screen max-w-9xl overflow-hidden bg-background">
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none !important;
        }
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>
      {/* High-Performance Smooth Scroll Container (Embla) */}
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex flex-col h-full w-full">
          {pages.map((pageNumber) => (
            <MemoizedPDFPage
              key={pageNumber}
              url={pdfUrl}
              page={pageNumber}
            />
          ))}
        </div>
      </div>

      {/* Mobile Navigation Controls: lets users open sidebar or jump to dashboard */}
      <div className="sm:hidden fixed top-4 left-4 z-50 flex items-center gap-2">
        <SidebarTrigger className="size-9 rounded-lg bg-background/90 border border-border/70 shadow-md backdrop-blur-md" />
        <Button
          asChild
          size="icon"
          variant="outline"
          className="size-9 rounded-lg bg-background/90 border-border/70 shadow-md backdrop-blur-md"
        >
          <Link href="/dashboard" aria-label="Go to dashboard">
            <LayoutDashboard className="h-4.5 w-4.5" />
          </Link>
        </Button>
      </div>

      {/* Premium Vertical Page Indicator / Scroll Dots */}
      {/* <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {pages.slice(0, 8).map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all duration-500 ${currentPage === idx
              ? "w-8 bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
              : "w-3 bg-foreground/20 hover:bg-foreground/40"
              }`}
            title={`Go to page ${idx + 1}`}
          />
        ))}
      </div> */}

      {/* Corner Action Panel */}
      <div className="absolute bottom-8 right-8 z-50 flex flex-col gap-3">
        <Button
          id="floating-download-btn"
          onClick={handleDownload}
          className="flex h-12 px-6 items-center justify-center gap-3 rounded-2xl bg-primary text-primary-foreground shadow-2xl transition-all hover:scale-105 active:scale-95 group overflow-hidden"
        >
          <Download className="h-5 w-5 transition-transform group-hover:translate-y-0.5" />
          <span className="text-xs font-black uppercase tracking-widest">Download Plan</span>
        </Button>
      </div>

    </div>
  );
}
