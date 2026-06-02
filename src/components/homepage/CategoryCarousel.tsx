"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import { fetchAPIJson } from "@/lib/fetchAPI";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

type Category = { _id: string; name: string; image?: string; isActive?: boolean };

const FALLBACK_IMAGES: Record<string, string> = {
  // REMOVED ALL FALLBACK IMAGES - Only show real data from admin
};

const getDisplayImage = (cat: Category, api: string | undefined) => {
  if (!cat.image) return '';
  
  const apiBase = api?.replace(/\/api\/?$/, '') || 'http://localhost:5002';
  const raw = cat.image || '';
  
  // Already a full URL (http or https)
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
  
  // Base64 image
  if (raw.startsWith('data:')) return raw;
  
  // Protocol-relative URL
  if (raw.startsWith('//')) return `https:${raw}`;
  
  // Local path - prepend API base URL
  if (raw.startsWith('/')) return `${apiBase}${raw}`;
  
  // For any other case, don't make assumptions - return empty
  return '';
};

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) { setLoading(false); return; }

    const loadCategories = async () => {
      try {
        // Use fetchAPI wrapper to handle CORS
        const data = await fetchAPIJson<{ categories: Category[] }>('/category/list');
        console.log("CATEGORY API:", data);

        // API returns { categories: [...] }
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.categories)
          ? data.categories
          : [];

        // Only show active categories
        const active = list.filter((c: Category) => c.isActive !== false);
        setCategories(active);

      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [api]);

  if (!loading && categories.length === 0) return null;

  return (
    <section className="max-w-frame mx-auto text-center px-4 xl:px-0">
      <motion.h2
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn([integralCF.className, "text-[32px] md:text-5xl mb-8 md:mb-14 capitalize"])}
      >
        Explore for More
      </motion.h2>

      <motion.div
        initial={{ y: "100px", opacity: 0 }}
        whileInView={{ y: "0", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {loading ? (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-pulse shrink-0">
                <div className="w-[160px] h-[220px] md:w-[220px] md:h-[300px] rounded-2xl bg-brand/5" />
                <div className="h-4 w-24 bg-brand/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <Carousel opts={{ align: "start" }} className="w-full mb-6 md:mb-9">
            <CarouselContent className="mx-4 xl:mx-0 space-x-6 lg:space-x-8">
              {categories.map(cat => (
                <CarouselItem key={cat._id} className="pl-0 basis-auto">
                  <Link
                    href={`/shop?categories=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className="relative w-[150px] h-[200px] sm:w-[220px] sm:h-[300px] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm group-hover:shadow-2xl group-hover:shadow-brand/20 transition-all duration-500 shrink-0">
                      <Image
                        src={getDisplayImage(cat, api)}
                        alt={cat.name}
                        fill
                        className="object-cover scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        unoptimized
                      />
                      {/* Premium Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    <span className="text-sm sm:text-lg font-bold text-black/80 group-hover:text-brand transition-all duration-300 uppercase tracking-wider">
                      {cat.name}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Prev / Next chevron buttons */}
            <CarouselPrevious
              className="hidden sm:flex -left-5 xl:-left-8 border-brand/20 text-brand hover:bg-brand hover:text-white hover:border-brand disabled:opacity-20"
            />
            <CarouselNext
              className="hidden sm:flex -right-5 xl:-right-8 border-brand/20 text-brand hover:bg-brand hover:text-white hover:border-brand disabled:opacity-20"
            />
          </Carousel>
        )}

        <Link
          href="/shop"
          className="inline-block px-[54px] py-4 border rounded-full hover:bg-brand hover:text-white text-brand transition-all font-medium text-sm sm:text-base border-brand/20"
        >
          View All
        </Link>
      </motion.div>
    </section>
  );
}
