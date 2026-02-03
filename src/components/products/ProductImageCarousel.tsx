'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { findImage } from '@/lib/placeholder-images';

type ProductImageCarouselProps = {
  images: string[];
  productName: string;
};

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  return (
    <Carousel className="w-full max-w-lg mx-auto">
      <CarouselContent>
        {images.map((imageId, index) => {
            const image = findImage(imageId);
            return (
                <CarouselItem key={index}>
                    <Card>
                    <CardContent className="relative aspect-[2/3] p-0">
                        {image && (
                            <Image
                                src={image.imageUrl}
                                alt={`${productName} - view ${index + 1}`}
                                fill
                                data-ai-hint={image.imageHint}
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}
                    </CardContent>
                    </Card>
                </CarouselItem>
            )
        })}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
