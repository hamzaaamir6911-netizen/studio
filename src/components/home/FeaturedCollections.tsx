import { getAllCategories } from '@/lib/placeholder-data';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { findImage } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';

export function FeaturedCollections() {
  const categories = getAllCategories();

  return (
    <section className="container mx-auto px-4">
      <h2 className="mb-8 text-3xl font-bold tracking-tight text-center font-headline">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryImage = findImage(category.image);
          return (
            <Link href={`/products?category=${category.name.toLowerCase()}`} key={category.id} className="group">
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    {categoryImage && (
                        <Image
                            src={categoryImage.imageUrl}
                            alt={category.name}
                            fill
                            data-ai-hint={categoryImage.imageHint}
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                      <h3 className="text-3xl font-bold font-headline">
                        {category.name}
                      </h3>
                      <div className="mt-4 flex items-center text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Shop Now</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
