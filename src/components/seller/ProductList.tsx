'use client';

import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { deleteProductAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, Trash2, Edit } from 'lucide-react';

export function ProductList({ sellerId }: { sellerId: string }) {
  const productsCollection = collection(db, 'products');
  const productsQuery = query(productsCollection, where('sellerId', '==', sellerId));
  const [products, loading, error] = useCollectionData(productsQuery, { idField: 'id' });
  const { toast } = useToast();

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProductAction(productId);
      if (result.error) {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      } else {
        toast({ title: 'Success', description: 'Product deleted successfully.' });
      }
    }
  };

  if (loading) {
     return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
    </div>
  }

  if (error) {
    return <p className="text-destructive text-center">Error loading products.</p>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">No products found</h2>
        <p className="mt-2 text-muted-foreground">Get started by adding your first product.</p>
        <Button asChild className="mt-6">
            <Link href="/seller/add-product">Add Product</Link>
        </Button>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {(products as Product[]).map((product) => {
        const imageUrl = product.images[0] || 'https://placehold.co/600x400';
        return (
          <Card key={product.id} className="flex flex-col">
            <CardHeader className="p-0">
                <div className="relative aspect-[4/3]">
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg font-semibold leading-snug">{product.name}</CardTitle>
              <p className="font-bold text-lg mt-2">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 flex gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/seller/edit-product/${product.id}`}><Edit className="mr-2"/>Edit</Link>
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(product.id)} className="w-full">
                <Trash2 className="mr-2"/>Delete
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
