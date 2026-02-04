'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { AiSearchAssistant } from '@/components/search/AiSearchAssistant';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [allProducts, loading, error] = useCollectionData(collection(db, 'products'), { idField: 'id' });

  const filteredProducts = useMemo(() => {
    if (!query || !allProducts) {
      return [];
    }
    return (allProducts as Product[]).filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      {query ? (
        <>
          <h1 className="text-3xl font-bold font-headline mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground mb-8">
            {loading ? 'Searching...' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'result' : 'results'} found.`}
          </p>
          
          {loading && <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>}

          {error && <p className="text-destructive text-center">Could not load products.</p>}

          {!loading && filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            !loading && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Nothing Found</h2>
              <p className="text-muted-foreground mb-8">
                Sorry, we couldn't find any products matching your search.
                <br />
                Maybe our AI assistant can help?
              </p>
              <AiSearchAssistant searchTerm={query} />
            </div>
            )
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold font-headline mb-4">Search Products</h1>
          <p className="text-muted-foreground">
            Please enter a search term in the search bar above.
          </p>
        </div>
      )}
    </div>
  );
}
