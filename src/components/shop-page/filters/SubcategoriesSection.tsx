"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { toggleSubcategory } from "@/lib/features/filters/filtersSlice";
import type { RootState } from "@/lib/store";

type Subcategory = { _id: string; name: string };

type ApiProduct = {
  category?: { name: string } | null;
  subcategory?: { _id: string; name: string } | null;
};

const SubcategoriesSection = () => {
  const [allSubs, setAllSubs] = useState<Subcategory[]>([]);
  const [catSubMap, setCatSubMap] = useState<Map<string, Set<string>>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const selectedSubs = useSelector((state: RootState) => state.filters.subcategories);
  const selectedCategories = useSelector((state: RootState) => state.filters.categories);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!api) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setError(null);
        const [subRes, prodRes] = await Promise.all([
          fetch(`${api}/subcategory`, {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }),
          fetch(`${api}/product?limit=500`, {
            signal: controller.signal,
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }),
        ]);

        if (!subRes.ok || !prodRes.ok) {
          throw new Error(`API error: ${subRes.status || prodRes.status}`);
        }

        const subData = await subRes.json();
        const prodData = await prodRes.json();

        if (isMounted) {
          const subs = Array.isArray(subData.subcategories) ? subData.subcategories : [];
          setAllSubs(subs);

          const map = new Map<string, Set<string>>();
          const products = Array.isArray(prodData.products) ? prodData.products : [];

          for (const p of products) {
            if (!p.category?.name || !p.subcategory?.name) continue;
            const catKey = p.category.name.toLowerCase();
            if (!map.has(catKey)) map.set(catKey, new Set());
            map.get(catKey)!.add(p.subcategory.name);
          }
          setCatSubMap(map);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted && e.name !== 'AbortError') {
          console.error('Failed to fetch subcategories:', e);
          setAllSubs([]);
          setCatSubMap(new Map());
          setError('Could not load brands');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [api]);

  // Derive visible subcategories based on selected categories
  const visibleSubs = useMemo(() => {
    if (selectedCategories.length === 0) return allSubs;

    const allowed = new Set<string>();
    for (const cat of selectedCategories) {
      const subs = catSubMap.get(cat.toLowerCase());
      if (subs) subs.forEach(s => allowed.add(s));
    }

    return allSubs.filter(s => allowed.has(s.name));
  }, [selectedCategories, allSubs, catSubMap]);

  if (!loading && allSubs.length === 0) return null;
  if (!loading && selectedCategories.length > 0 && visibleSubs.length === 0) return null;

  return (
    <Accordion type="single" collapsible defaultValue="filter-subcategory">
      <AccordionItem value="filter-subcategory" className="border-none">
        <AccordionTrigger className="text-brand font-bold text-xl hover:no-underline p-0 py-0.5">
          Brands
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-4 bg-brand/10 rounded w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : (
            <div className="flex flex-col space-y-2">
              {visibleSubs.map((sub) => (
                <label key={sub._id} className="flex items-center space-x-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={selectedSubs.includes(sub.name)}
                    onChange={() => dispatch(toggleSubcategory(sub.name))}
                    className="w-4 h-4 rounded border-brand/30 cursor-pointer"
                  />
                  <span className="text-sm text-brand/60">{sub.name}</span>
                </label>
              ))}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default SubcategoriesSection;
