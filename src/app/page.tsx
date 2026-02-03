import { FeaturedCollections } from '@/components/home/FeaturedCollections';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { getFeaturedProducts } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-24 pb-12 md:pb-16 lg:pb-24">
      <HeroSection />
      <FeaturedCollections />
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">
          Featured Products
        </h2>
        <ProductGrid products={featuredProducts.slice(0, 8)} />
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
