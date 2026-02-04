'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const { addToCart } = useCart();
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ product, quantity: 1, size: selectedSize, color: selectedColor });
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your shopping cart.`,
    });
  };
  
  const handleWishlistToggle = () => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
      toast({ title: 'Removed from Wishlist' });
    } else {
      addToWishlist(product);
      toast({ title: 'Added to Wishlist' });
    }
  };

  const productInWishlist = isWishlisted(product.id);

  return (
    <div className="py-4">
      <h1 className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</h1>
      <p className="text-2xl mt-2 font-semibold text-primary">${product.price.toFixed(2)}</p>
      <p className="mt-4 text-muted-foreground">{product.description}</p>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground">Size</h3>
        <RadioGroup
          value={selectedSize}
          onValueChange={setSelectedSize}
          className="mt-2 flex gap-2"
        >
          {product.sizes.map((size) => (
            <Label
              key={size}
              htmlFor={`size-${size}`}
              className={cn(
                "border rounded-md py-2 px-4 text-sm font-medium cursor-pointer transition-colors",
                selectedSize === size
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
              {size}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-foreground">Color</h3>
        <RadioGroup
            value={selectedColor.hex}
            onValueChange={(hex) => setSelectedColor(product.colors.find(c => c.hex === hex) || product.colors[0])}
            className="mt-2 flex gap-2"
        >
            {product.colors.map((color) => (
                <Label key={color.name} htmlFor={`color-${color.name}`} className="cursor-pointer">
                    <RadioGroupItem value={color.hex} id={`color-${color.name}`} className="sr-only" />
                    <div 
                        className={cn(
                            "h-8 w-8 rounded-full border-2",
                            selectedColor.hex === color.hex ? 'border-primary' : 'border-transparent'
                        )}
                    >
                         <div className="h-full w-full rounded-full border-2 border-card" style={{ backgroundColor: color.hex }} />
                    </div>
                </Label>
            ))}
        </RadioGroup>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button size="lg" className="flex-grow min-w-[170px]" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
        <Button size="lg" variant="outline" className="flex-grow min-w-[170px]" onClick={handleWishlistToggle}>
          <Heart className={cn("mr-2 h-5 w-5", productInWishlist && "fill-destructive text-destructive")} />
          {productInWishlist ? 'In Wishlist' : 'Wishlist'}
        </Button>
        <Button size="lg" variant="outline" className="flex-grow min-w-[170px]" asChild>
          <Link href={`/try-on?productId=${product.id}`}>
            <Sparkles className="mr-2 h-5 w-5" />
            Virtual Try-On
          </Link>
        </Button>
      </div>
    </div>
  );
}
