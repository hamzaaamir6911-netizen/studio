import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { findImage } from '@/lib/placeholder-images';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
    const productImage = findImage(product.images[0]);

  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden">
            {productImage && (
                <Image
                    src={productImage.imageUrl}
                    alt={product.name}
                    fill
                    data-ai-hint={productImage.imageHint}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            )}
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-semibold text-base flex-grow">{product.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
            <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
