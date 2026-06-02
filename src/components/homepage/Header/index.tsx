"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAPIJson } from "@/lib/fetchAPI";

type BannerSlide = {
  _id: string;
  desktopImage: string;
  mobileImage: string;
  isActive: boolean;
  desktopFit?: string;
  desktopPosition?: string;
  mobileFit?: string;
  mobilePosition?: string;
  align: "left" | "center" | "right";
  tag: string;
  headline: string;
  subheadline: string;
  cta?: string;
  ctaSecondary?: string;
};

// NO FALLBACK IMAGES - Only show real admin data
const fallbackSlides: BannerSlide[] = [];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [paused, setPaused] = useState(false);
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const api = process.env.NEXT_PUBLIC_API_URL

  // Helper to resolve image URLs
  const resolveImageUrl = useCallback((imageUrl: string): string => {
    if (!imageUrl) return '';
    
    // Already a full URL
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;
    
    // Base64 image
    if (imageUrl.startsWith('data:')) return imageUrl;
    
    // Protocol-relative URL
    if (imageUrl.startsWith('//')) return `https:${imageUrl}`;
    
    // Local path - prepend API base URL
    if (imageUrl.startsWith('/')) {
      const apiBase = api?.replace(/\/api\/?$/, '') || 'http://localhost:5002';
      return `${apiBase}${imageUrl}`;
    }
    
    return imageUrl;
  }, [api]);

  const goTo = useCallback(
    (index: number, dir: "next" | "prev" = "next") => {
      if (animating || index === current) return;
      setDirection(dir);
      setPrev(current);
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => {
        setPrev(null);
        setAnimating(false);
      }, 700);
    },
    [animating, current]
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // set initial value on client
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Force fresh data from API - no cache at all
        const data = await fetchAPIJson<{ banners: BannerSlide[] }>('/banner', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        console.log("HeroBanner: Fetched banners:", data);

        if (data && data.banners && Array.isArray(data.banners)) {
          const activeBanners = data.banners.filter((b: BannerSlide) => b.isActive);
          console.log("HeroBanner: Active banners:", activeBanners);
          
          if (activeBanners.length > 0) {
            // Resolve image URLs to full paths
            const resolvedBanners = activeBanners.map(b => ({
              ...b,
              desktopImage: resolveImageUrl(b.desktopImage),
              mobileImage: resolveImageUrl(b.mobileImage)
            }));
            console.log("HeroBanner: Resolved banners with image URLs:", resolvedBanners);
            setSlides(resolvedBanners);
            return;
          }
        }
        
        console.error("HeroBanner: No active banners found in API response");
        setSlides([]);
      } catch (err) {
        console.error("HeroBanner: Failed to fetch banners from API:", err);
        setSlides([]);
      }
    };

    fetchBanners();
  }, [api, resolveImageUrl]);

  const next = useCallback(() => {
    if (slides.length > 0) {
      goTo((current + 1) % slides.length, "next");
    }
  }, [current, goTo, slides.length]);

  const back = useCallback(() => {
    if (slides.length > 0) {
      goTo((current - 1 + slides.length) % slides.length, "prev");
    }
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  // Show nothing if no slides - don't show fallback
  if (!slides || slides.length === 0) {
    console.warn("HeroBanner: No slides available - banner hidden");
    return null;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ═══════════════════════════════════════════════════════════════════════ */
        /* BANNER CONTAINER - RESPONSIVE HEIGHTS */
        /* ═══════════════════════════════════════════════════════════════════════ */
        .banner-root {
          font-family: 'Montserrat', sans-serif;
          position: relative;
          width: 100%;
          height: 85vh;
          min-height: 500px;
          max-height: 850px;
          background: #f5f5f5;
          overflow: hidden;
          cursor: default;
        }

        @media (max-width: 1024px) {
          .banner-root {
            height: 75vh;
            min-height: 450px;
            max-height: 700px;
          }
        }

        @media (max-width: 768px) {
          .banner-root {
            height: 65vh;
            min-height: 350px;
            max-height: 550px;
          }
        }

        @media (max-width: 480px) {
          .banner-root {
            height: 60vh;
            min-height: 300px;
            max-height: 450px;
          }
        }

        /* ═══════════════════════════════════════════════════════════════════════ */
        /* SLIDE IMAGE - FILLS WIDTH WITHOUT SIDE WHITESPACE */
        /* object-fit: cover fills entire container without gaps */
        /* object-position: center keeps focal point centered on all screen sizes */
        /* ═══════════════════════════════════════════════════════════════════════ */
        .slide-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          background-color: #f5f5f5;
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          -webkit-user-select: none;
          user-select: none;
          display: block;
        }

        /* Fallback for browsers that don't support object-fit */
        @supports not (object-fit: cover) {
          .slide-img {
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            background-color: #f5f5f5;
          }
        }

        .slide-img.active {
          opacity: 1 !important;
          transform: scale(1) !important;
          z-index: 2 !important;
          visibility: visible !important;
        }

        .slide-img.exiting {
          opacity: 0;
          transform: scale(1);
          z-index: 1;
          visibility: hidden;
        }

        .slide-img.idle {
          opacity: 0;
          z-index: 0;
          visibility: hidden;
        }

        /* ═══════════════════════════════════════════════════════════════════════ */
        /* OVERLAY - SUBTLE GRADIENT */
        /* ═══════════════════════════════════════════════════════════════════════ */
        .slide-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            105deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
        }

        .slide-overlay.center {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.15) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.15) 100%
          );
        }

        .slide-overlay.right {
          background: linear-gradient(
            255deg,
            rgba(255, 255, 255, 0.7) 0%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
        }

        /* ═══════════════════════════════════════════════════════════════════════ */
        /* CONTENT CONTAINER - TEXT & BUTTONS */
        /* ═══════════════════════════════════════════════════════════════════════ */
        .banner-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 8vw;
        }

        .banner-content.center {
          justify-content: center;
          text-align: center;
        }

        .banner-content.right {
          justify-content: flex-end;
          padding-right: 6vw;
        }

        .text-block {
          max-width: 560px;
          z-index: 5;
          position: relative;
        }

        .banner-content.center .text-block {
          max-width: 620px;
        }

        /* ───────────────────────────────────────────────────────────────────── */
        /* TABLET RESPONSIVE (1024px and below) */
        /* ───────────────────────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .banner-content {
            padding: 0 6vw;
          }

          .banner-content.right {
            padding-right: 4vw;
          }

          .text-block {
            max-width: 480px;
          }

          .banner-content.center .text-block {
            max-width: 520px;
          }
        }

        /* ───────────────────────────────────────────────────────────────────── */
        /* MOBILE RESPONSIVE (768px and below) */
        /* ───────────────────────────────────────────────────────────────────── */
        @media (max-width: 768px) {
          .banner-content {
            padding: 0 5vw;
            justify-content: center;
            text-align: center;
          }

          .banner-content.right {
            justify-content: center;
            text-align: center;
            padding: 0 5vw;
          }

          .banner-content.left {
            justify-content: center;
            text-align: center;
          }

          .text-block {
            max-width: 100%;
          }

          .banner-content.center .text-block {
            max-width: 100%;
          }
        }

        /* ───────────────────────────────────────────────────────────────────── */
        /* SMALL MOBILE RESPONSIVE (480px and below) */
        /* ───────────────────────────────────────────────────────────────────── */
        @media (max-width: 480px) {
          .banner-content {
            padding: 0 4vw;
          }

          .text-block {
            max-width: 100%;
          }

          .banner-content.center .text-block {
            max-width: 100%;
          }
        }

        /* tag */
        .slide-tag {
          display: inline-block;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--brand);
          border: 1.5px solid var(--brand);
          padding: 8px 16px;
          margin-bottom: 22px;
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.55s 0.1s forwards;
          border-radius: 4px;
        }

        /* headline */
        .slide-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 6vw, 5.5rem);
          font-weight: 300;
          line-height: 1.1;
          letter-spacing: -0.01em;
          color: #1a1a1a;
          white-space: pre-line;
          margin: 0 0 24px 0;
          opacity: 0;
          transform: translateY(24px);
          animation: fadeUp 0.6s 0.22s forwards;
        }

        /* sub */
        .slide-sub {
          font-size: clamp(0.875rem, 2vw, 1rem);
          font-weight: 300;
          line-height: 1.65;
          color: #555;
          max-width: 450px;
          margin-bottom: 36px;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 0.6s 0.36s forwards;
        }
        .banner-content.center .slide-sub { 
          margin-left: auto; 
          margin-right: auto; 
        }

        /* buttons */
        .btn-row {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.55s 0.5s forwards;
        }
        .banner-content.center .btn-row { justify-content: center; }

        .btn-primary {
          background: var(--brand);
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(0.7rem, 1.2vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-primary:hover { 
          background: var(--brand-dark); 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 58, 140, 0.3);
        }

        .btn-ghost {
          background: transparent;
          color: var(--brand);
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(0.7rem, 1.2vw, 0.9rem);
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: 1.5px solid var(--brand);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .btn-ghost:hover { 
          background: var(--brand); 
          color: #fff; 
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(45, 58, 140, 0.2);
        }

        /* ── progress bar ── */
        .progress-bar {
          display: none;
        }
        @keyframes progress {
          from { width: 0; }
          to   { width: 100%; }
        }

        /* ── nav arrows ── */
        .arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 8;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(45, 58, 140, 0.3);
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          border-radius: 50%;
        }
        .arrow-btn:hover {
          background: var(--brand);
          border-color: var(--brand);
          transform: translateY(-50%) scale(1.08);
        }
        .arrow-btn:hover svg { stroke: #fff; }
        .arrow-btn svg { 
          stroke: var(--brand); 
          transition: stroke 0.2s ease;
          width: 20px;
          height: 20px;
        }
        .arrow-left  { left: 32px; }
        .arrow-right { right: 32px; }

        @media (max-width: 768px) {
          .arrow-btn { 
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
          }
          .arrow-left  { left: 16px; }
          .arrow-right { right: 16px; }
        }

        @media (max-width: 480px) {
          .arrow-btn { display: none; }
        }

        /* ── dot indicators ── */
        .dots {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 8;
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid var(--brand);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .dot:hover {
          background: var(--brand);
          opacity: 0.7;
        }
        .dot.active {
          background: var(--brand);
          transform: scale(1.3);
        }

        /* ── slide counter ── */
        .slide-counter {
          position: absolute;
          bottom: 28px;
          right: 44px;
          z-index: 8;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          color: #aaa;
          font-weight: 500;
          background: rgba(255, 255, 255, 0.7);
          padding: 6px 12px;
          border-radius: 4px;
          backdrop-filter: blur(8px);
        }
        .slide-counter span { 
          color: var(--brand); 
          font-weight: 700; 
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .banner-content { padding: 0 5vw; }
          .banner-content.right { justify-content: flex-start; }
        }

        @media (max-width: 480px) {
          .slide-counter { display: none; }
          .dots {
            bottom: 20px;
            gap: 8px;
          }
          .dot {
            width: 6px;
            height: 6px;
          }
        }
      `}</style>

      <section
        className="banner-root"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Hero banner"
      >
        {/* slide images */}
        {slides.map((s, i) => {
          let cls = "slide-img idle";
          if (i === current) cls = "slide-img active";
          else if (i === prev) cls = "slide-img exiting";
          const imageSrc = isMobile && s.mobileImage ? s.mobileImage : s.desktopImage;
          
          return (
            <img
              key={s._id}
              className={cls}
              src={imageSrc}
              alt={s.headline}
              aria-hidden={i !== current}
              loading="eager"
              decoding="async"
              style={{ visibility: i === current ? 'visible' : 'hidden' }}
            />
          );
        })}

        {/* overlay */}
        <div className={`slide-overlay ${slides[current].align}`} />

        {/* text content — re-mount on slide change to retrigger animations */}
        <div className={`banner-content ${slides[current].align}`} key={current}>
          <div className="text-block">
            {/* <span className="slide-tag">{slides[current].tag}</span> */}

            <h1 className="slide-headline">{slides[current].headline}</h1>
            <p className="slide-sub">{slides[current].subheadline}</p>
            <div className="btn-row">
              {/* <button className="btn-primary">{slide.cta}</button>
              {slide.ctaSecondary && (
                <button className="btn-ghost">{slide.ctaSecondary}</button>
              )} */}
            </div>
          </div>
        </div>

        {/* progress bar */}
        {!paused && <div className="progress-bar" key={`pb-${current}`} />}

        {/* arrows */}
        <button className="arrow-btn arrow-left" onClick={back} aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="arrow-btn arrow-right" onClick={next} aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* dots */}
        <div className="dots" role="tablist" aria-label="Slide navigation">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot${i === current ? " active" : ""}`}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* counter */}
        <div className="slide-counter">
          <span>{String(current + 1).padStart(2, "0")}</span> /{" "}
          {String(slides.length).padStart(2, "0")}
        </div>
      </section>
    </>
  );
}
