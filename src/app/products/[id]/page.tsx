'use client';

import { notFound, useParams } from 'next/navigation';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { ProductDetails } from '@/components/products/ProductDetails';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const params = useParams();
  const { id } = params;

  const [product, loading, error] = useDocumentData(doc(db, 'products', id as string), { idField: 'id' });

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <Skeleton className="h-[500px] w-full" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        </div>
    );
  }
  
  if (error || !product) {
    // Consider a more specific error page or message
    if (!product && !loading) notFound();
    return <p className="text-center text-destructive">Error loading product.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageCarousel images={product.images} productName={product.name} />
        <ProductDetails product={product as Product} />
      </div>

      {/* Related products section removed for simplicity */}
    </div>
  );
}
