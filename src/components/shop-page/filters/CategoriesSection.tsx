"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "@/lib/features/filters/filtersSlice";
import type { RootState } from "@/lib/store";
import { fetchAPIJson } from "@/lib/fetchAPI";

type Category = { _id: string; name: string; slug: string };

const CategoriesSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const selectedCategories = useSelector((state: RootState) => state.filters.categories);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setError(null);
        setLoading(true);

        const data = await fetchAPIJson<{ categories: Category[] }>('category', {
          signal: controller.signal
        });
        
        if (isMounted) {
          const cats = Array.isArray(data.categories) ? data.categories : [];
          setCategories(cats);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted && err.name !== 'AbortError') {
          console.error('Failed to fetch categories:', err);
          setCategories([]);
          setError('Could not load categories');
        }
        // Silently ignore AbortError - it's expected on cleanup
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <Accordion type="single" collapsible defaultValue="filter-category">
      <AccordionItem value="filter-category" className="border-none">
        <AccordionTrigger className="text-brand font-bold text-xl hover:no-underline p-0 py-0.5">
          Category
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-brand/10 rounded w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-sm text-red-500">{error}</div>
          ) : categories.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center space-x-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => dispatch(toggleCategory(cat.name))}
                    className="w-4 h-4 rounded border-brand/30 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-brand">{cat.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-sm text-brand/60">No categories available</div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoriesSection;
