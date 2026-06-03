"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const test = async () => {
      try {
        setLoading(true);
        console.log("API URL:", api);

        // Test health
        const healthRes = await fetch("http://localhost:5002/health");
        const health = await healthRes.json();
        console.log("Health:", health);

        // Test products
        const prodRes = await fetch(`${api}/product`);
        const products = await prodRes.json();
        console.log("Products:", products);

        setData({
          health,
          products,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    test();
  }, [api]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
