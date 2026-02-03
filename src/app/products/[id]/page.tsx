import { getProductById, getRelatedProducts } from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import { ProductImageCarousel } from '@/components/products/ProductImageCarousel';
import { ProductDetails } from '@/components/products/ProductDetails';
import { ProductGrid } from '@/components/shared/ProductGrid';

type ProductPageProps = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, product.category);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <ProductImageCarousel images={product.images} productName={product.name} />
        <ProductDetails product={product} />
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold tracking-tight text-center font-headline mb-8">
            You Might Also Like
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
