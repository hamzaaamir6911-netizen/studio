'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { findImage } from '@/lib/placeholder-images';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8 text-center">
        Shopping Cart
      </h1>
      {items.length === 0 ? (
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground" />
          <p className="mt-4 text-lg text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {items.map((item, index) => {
                    const productImage = findImage(item.product.images[0]);
                    return (
                      <li key={index} className="flex items-start p-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-md">
                          {productImage && (
                            <Image
                              src={productImage.imageUrl}
                              alt={item.product.name}
                              width={96}
                              height={96}
                              data-ai-hint={productImage.imageHint}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} / Color: {item.color.name}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            ${item.product.price.toFixed(2)}
                          </p>
                          <div className="flex items-center mt-2">
                            <label htmlFor={`quantity-${index}`} className="sr-only">Quantity</label>
                            <input
                              id={`quantity-${index}`}
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item, parseInt(e.target.value))
                              }
                              className="w-16 rounded-md border border-input px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item)}
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button asChild className="w-full mt-6">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
