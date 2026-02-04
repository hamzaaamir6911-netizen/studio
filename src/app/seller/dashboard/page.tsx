'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { ProductList } from '@/components/seller/ProductList';
import { Skeleton } from '@/components/ui/skeleton';

export default function SellerDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-1/4 mb-8" />
        <Skeleton className="h-96 w-full" />
    </div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (user.role !== 'seller') {
    router.push('/'); // Or a dedicated "access denied" page
    return <p>Access Denied</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Products</h1>
        <Button asChild>
          <Link href="/seller/add-product">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>
      <ProductList sellerId={user.uid} />
    </div>
  );
}
