import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { findImage } from '@/lib/placeholder-images';

export function HeroSection() {
    const heroImage = findImage('hero_image');

    return (
        <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-white">
            {heroImage && (
                 <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    fill
                    priority
                    data-ai-hint={heroImage.imageHint}
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 text-center p-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline leading-tight">
                    The Art of Style
                </h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    Find your style, find your fashion.
                </p>
                <Button asChild size="lg" className="mt-8 bg-primary/80 hover:bg-primary border-primary-foreground/20 border">
                    <Link href="/products">Shop The New Collection</Link>
                </Button>
            </div>
        </section>
    );
}
