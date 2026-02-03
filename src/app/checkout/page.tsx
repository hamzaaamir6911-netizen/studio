'use client';

import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { findImage } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process payment and create an order in Firestore
    console.log('Placing order...');
    toast({
      title: 'Order Placed!',
      description: 'Thank you for your purchase.',
    });
    clearCart();
    router.push('/orders');
  };

  if (items.length === 0) {
    // This part should ideally not be reached if checkout is protected or cart is empty,
    // but it's a good fallback.
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
            <p className="text-lg text-muted-foreground">Your cart is empty. You cannot proceed to checkout.</p>
            <Button asChild className="mt-6">
                <a href="/products">Continue Shopping</a>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8 text-center">
        Checkout
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="Your City" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postal-code">Postal Code</Label>
                        <Input id="postal-code" placeholder="12345" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" placeholder="Your Country" required />
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Order</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-4">
                  {items.map((item, index) => {
                    const productImage = findImage(item.product.images[0]);
                    return (
                        <li key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                    {productImage && (
                                        <Image
                                        src={productImage.imageUrl}
                                        alt={item.product.name}
                                        width={64}
                                        height={64}
                                        data-ai-hint={productImage.imageHint}
                                        className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-semibold">{item.product.name}</h3>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                        </li>
                    );
                  })}
                </ul>
                <Separator />
                <div className="space-y-2 mt-4">
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
                <Card className="mt-6 p-4 bg-secondary">
                    <h3 className="font-semibold mb-2">Payment</h3>
                    <p className="text-sm text-muted-foreground">Payment gateway integration placeholder. Clicking "Place Order" will simulate a successful transaction.</p>
                </Card>
                <Button type="submit" className="w-full mt-6">
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
