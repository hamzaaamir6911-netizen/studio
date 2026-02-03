'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { getAllProducts } from '@/lib/placeholder-data';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { AiSearchAssistant } from '@/components/search/AiSearchAssistant';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const allProducts = useMemo(() => getAllProducts(), []);

  const filteredProducts = useMemo(() => {
    if (!query) {
      return [];
    }
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
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
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} found.
          </p>

          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">Nothing Found</h2>
              <p className="text-muted-foreground mb-8">
                Sorry, we couldn't find any products matching your search.
                <br />
                Maybe our AI assistant can help?
              </p>
              <AiSearchAssistant searchTerm={query} />
            </div>
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
