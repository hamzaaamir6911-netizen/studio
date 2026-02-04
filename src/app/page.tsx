'use client';

import { HeroSection } from '@/components/home/HeroSection';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { collection, query, where, limit } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase/config';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function FeaturedProducts() {
    const productsCollection = collection(db, 'products');
    const featuredQuery = query(productsCollection, where('isFeatured', '==', true), limit(8));
    
    const [products, loading, error] = useCollectionData(featuredQuery, { idField: 'id' });

    if (loading) {
        return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
        </div>
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading featured products: {error.message}</p>
    }

    return <ProductGrid products={products as Product[] || []} />
}


export default function Home() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 lg:gap-24 pb-12 md:pb-16 lg:pb-24">
      <HeroSection />
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">
          Featured Products
        </h2>
        <FeaturedProducts />
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
