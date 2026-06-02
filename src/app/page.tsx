import HeroBanner from "@/components/homepage/Header";
import CategoryCarousel from "@/components/homepage/CategoryCarousel";


export default function Home() {
  return (
    <>
      <HeroBanner />
      <main className="my-[50px] sm:my-[72px]">
        <CategoryCarousel />
      </main>
    </>
  );
}
