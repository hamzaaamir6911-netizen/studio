'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data, in a real app this would be fetched from Firestore
const MOCK_ORDERS: Order[] = [
  {
    id: 'RB12345',
    userId: 'mock-user',
    items: [], // simplified for mock
    total: 185.00,
    date: new Date('2024-05-20').toISOString(),
    status: 'Delivered',
    shippingAddress: { name: '', address: '', city: '', postalCode: '', country: '' },
  },
  {
    id: 'RB12346',
    userId: 'mock-user',
    items: [],
    total: 75.50,
    date: new Date('2024-05-28').toISOString(),
    status: 'Shipped',
    shippingAddress: { name: '', address: '', city: '', postalCode: '', country: '' },
  },
    {
    id: 'RB12347',
    userId: 'mock-user',
    items: [],
    total: 320.00,
    date: new Date().toISOString(),
    status: 'Pending',
    shippingAddress: { name: '', address: '', city: '', postalCode: '', country: '' },
  },
];

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      // In a real app, fetch orders for `user.uid` from Firestore.
      // For now, we use mock data.
      setOrders(MOCK_ORDERS);
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-headline mb-8">Order History</h1>
            <div className="space-y-6">
                <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/3" /></CardContent></Card>
                <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/3" /></CardContent></Card>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">You haven't placed any orders yet.</p>
           <Button asChild className="mt-6">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="font-headline text-xl">Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge 
                    variant={order.status === 'Delivered' ? 'default' : order.status === 'Cancelled' ? 'destructive' : 'secondary'}
                    className="capitalize"
                >
                    {order.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">This is a placeholder for order items.</p>
                 <p className="text-sm text-muted-foreground">In a real app, you would see the products from your order here.</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                <Button variant="outline" disabled={order.status !== 'Shipped' && order.status !== 'Pending'}>Track Order</Button>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-lg">${order.total.toFixed(2)}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
