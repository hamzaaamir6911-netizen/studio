'use client';

import { Suspense } from 'react';
import { VirtualTryOnClient } from '@/components/try-on/VirtualTryOnClient';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function TryOnPageFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-[600px] w-full" />
      </div>
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function TryOnPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">Virtual Try-On</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          See how it looks before you buy.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Try Clothes On Your Photo</CardTitle>
          <CardDescription>
            Upload a photo of yourself to see how this item might look on you.
            This is an experimental AI feature, results may vary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TryOnPageFallback />}>
            <VirtualTryOnClient />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
