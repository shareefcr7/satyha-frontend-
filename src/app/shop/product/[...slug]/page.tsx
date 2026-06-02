import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import { Product } from "@/types/product.types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const api = process.env.NEXT_PUBLIC_API_URL;

async function getProduct(id: string): Promise<Product | null> {
  if (!api) return null;
  try {
    const res = await fetch(`${api}/product/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return null;
    const data = await res.json();
    const p = data.product ?? data;

    return {
      id: p._id || p.id,
      name: p.name || "",
      title: p.name || "",
      category: p.category?.name || "General",
      shortDescription: p.shortDescription || "",
      description: p.description || "",
      mainImage: p.mainImage || "",
      srcUrl: p.mainImage || "/images/pic1.png",
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      mrpPrice: p.mrpPrice || 0,
      offerAmount: p.offerAmount || 0,
      sellingPrice: p.sellingPrice || 0,
      price: p.sellingPrice || 0,
      totalStock: p.totalStock || 0,
      stock: p.totalStock || 0,
      discount: { amount: 0, percentage: 0 },
      rating: 4,
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const productId = slug[0];
  
  try {
    const productData = await getProduct(productId);

    if (!productData?.title) {
      notFound();
    }

    return (
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbProduct title={productData?.title ?? "product"} />
          <section className="mb-11">
            <Header data={productData} />
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Product page error:", error);
    notFound();
  }
}
