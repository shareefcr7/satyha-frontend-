"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import InputGroup from "@/components/ui/input-group";
import { useRouter } from "next/navigation";

type Suggestion = {
  id: string;
  title: string;
  category: string;
  price: number;
  srcUrl: string;
};

const SearchInput = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!query.trim() || !api) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${api}/product?search=${encodeURIComponent(query.trim())}&limit=5`,
          { signal: controller.signal }
        );
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) {
          setSuggestions([]);
          return;
        }
        const data = await res.json();
        if (data.products && Array.isArray(data.products)) {
          setSuggestions(
            data.products.slice(0, 5).map((p: any) => {
              const v = p.variants?.find((v: any) => v.isDefault) || p.variants?.[0];
              return {
                id: p._id,
                title: p.name,
                category: p.category?.name || "General",
                price: v?.price || 0,
                srcUrl: v?.images?.[0] || "/images/pic1.png",
              };
            })
          );
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current?.contains(e.target as Node) === false &&
        inputRef.current?.contains(e.target as Node) === false
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (id: string, name: string) => {
    router.push(`/shop/product/${id}/${name.split(" ").join("-")}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full md:mr-3 lg:mr-10">
      <form onSubmit={handleSearch}>
        {/* Search bar — white bg, gray border, navy focus ring */}
        <InputGroup className="flex bg-white border border-gray-200 rounded-full focus-within:border-brand focus-within:ring-1 focus-within:ring-brand transition-all">
          <InputGroup.Text>
            <Image priority src="/icons/search.svg" height={20} width={20} alt="search" className="min-w-5 min-h-5" />
          </InputGroup.Text>
          <InputGroup.Input
            ref={inputRef}
            type="search"
            name="search"
            placeholder="Search for products..."
            className="bg-transparent placeholder:text-black/30 text-black/80"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query && suggestions.length > 0 && setShowSuggestions(true)}
          />
        </InputGroup>
      </form>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSuggestionClick(p.id, p.title)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="relative w-12 h-12 flex-shrink-0 rounded bg-gray-50 overflow-hidden">
                    <Image src={p.srcUrl} alt={p.title} fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                    <p className="text-sm font-semibold text-brand mt-0.5">₹{p.price}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={() => { router.push(`/shop?search=${encodeURIComponent(query)}`); setShowSuggestions(false); }}
                className="w-full p-3 text-center text-sm font-medium text-brand hover:bg-gray-50 transition-colors"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center text-black/40 text-sm">No products found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
