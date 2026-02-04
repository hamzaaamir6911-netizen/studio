'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { handleVirtualTryOn } from '@/lib/actions';
import { getProductById } from '@/lib/placeholder-data';
import { findImage } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const initialState = {
  tryOnImage: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Try It On'
      )}
    </Button>
  );
}

export function VirtualTryOnClient() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [state, formAction] = useFormState(handleVirtualTryOn, initialState);
  const [userImage, setUserImage] = useState<string | null>(null);

  if (!productId) {
    return (
      <div className="text-center py-8">
        <p className="mb-4 text-muted-foreground">
          Please select a product to try on first.
        </p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const product = getProductById(productId);

  if (!product) {
    return <p>Product not found.</p>;
  }

  const productImage = findImage(product.images[0]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        {productImage && (
          <div className="aspect-[3/4] relative">
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              fill
              className="rounded-lg object-cover w-full"
              data-ai-hint={productImage.imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
        )}
      </div>
      <div className="md:col-span-2 space-y-6">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="productId" value={productId} />
          {userImage && <input type="hidden" name="userImage" value={userImage} />}
          
          <div className="space-y-2">
            <Label htmlFor="user-photo" className="text-base font-medium">1. Upload your photo</Label>
            <Input id="user-photo" type="file" accept="image/*" onChange={handleFileChange} required />
            <p className="text-sm text-muted-foreground">For best results, use a clear, full-body photo where you are facing forward.</p>
          </div>

          {userImage && (
             <div className="space-y-2">
              <Label className="text-base font-medium">2. Generate your try-on</Label>
              <SubmitButton />
            </div>
          )}
        </form>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {userImage && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-center">Your Photo</h3>
                    <div className="aspect-[3/4] relative">
                        <Image
                            src={userImage}
                            alt="Your uploaded photo"
                            fill
                            className="rounded-lg object-cover w-full"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </div>
            )}
            
            {state.tryOnImage && (
              <div className="space-y-2">
                <h3 className="font-semibold text-center text-primary">Your Virtual Try-On!</h3>
                 <div className="aspect-[3/4] relative">
                    <Image
                    src={state.tryOnImage}
                    alt="Virtual try-on result"
                    fill
                    className="rounded-lg object-cover w-full"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
              </div>
            )}
        </div>

        {state.error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
            </Alert>
        )}
      </div>
    </div>
  );
}
