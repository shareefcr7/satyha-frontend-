"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

type Category = { _id: string; name: string; image?: string; isActive?: boolean };

const FALLBACK_IMAGES: Record<string, string> = {
  "t shirts": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
  "shirts": "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80",
  "baggys": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
  "baggys ( all type)": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
  "cap": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80",
  "watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  "socks": "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=500&q=80",
  "ring": "https://images.unsplash.com/photo-1605100804763-247f66126be8?w=500&q=80",
  "neckchain": "https://images.unsplash.com/photo-1599643478524-fb9122870167?w=500&q=80",
  "hand band": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
  "studs": "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80",
  "cream emirates": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&q=80",
  "gel face wash": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80",
  "the face shop": "https://images.unsplash.com/photo-1571781526291-c477eb311dc6?w=500&q=80",
  "skin care product": "https://images.unsplash.com/photo-1615397323041-331e84ce00b9?w=500&q=80",
  "bright pro": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80"
};

const getDisplayImage = (cat: Category) => {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
  const apiBase = api.replace(/\/api\/?$/, '');

  const raw = cat.image || '';
  const resolve = (r: string) => {
    if (!r) return '';
    if (r.startsWith('data:')) return r;
    if (r.startsWith('//')) return `https:${r}`;
    if (r.startsWith('http://')) return r.replace('http://', 'https://');
    if (r.startsWith('https://')) return r;
    if (r.startsWith('/')) return `${apiBase}${r}`;
    if (r.includes('.') && !r.includes(' ')) return `https://${r}`;
    return r;
  };

  const resolved = resolve(raw);
  if (resolved && resolved.startsWith('http')) return resolved;

  const key = cat.name.toLowerCase().trim();
  if (FALLBACK_IMAGES[key]) return FALLBACK_IMAGES[key];

  // Find partial match
  const partialMatch = Object.keys(FALLBACK_IMAGES).find(k => key.includes(k));
  if (partialMatch) return FALLBACK_IMAGES[partialMatch];

  // Default apparel image
  return 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80';
};

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) { setLoading(false); return; }

    fetch(`${api}/category/list`)
  .then(res => {
    if (
      !res.ok ||
      !res.headers.get("content-type")?.includes("application/json")
    ) {
      throw new Error("Invalid response from server");
    }

    return res.json();
  })

  .then(data => {

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

  })

  .catch(err => {
    console.error("Failed to fetch categories:", err);
  })

  .finally(() => setLoading(false));

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
                        src={getDisplayImage(cat)}
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
