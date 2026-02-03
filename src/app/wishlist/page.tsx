'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WishlistPage() {
  const { wishlist, products } = useWishlist();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-headline mb-8 text-center">My Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8 text-center">
        My Wishlist
      </h1>
      {wishlist.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="mx-auto h-24 w-24 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">Your wishlist is empty.</p>
          <p className="text-sm text-muted-foreground">Click the heart on a product to save it.</p>
          <Button asChild className="mt-6">
            <Link href="/products">Discover Products</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
