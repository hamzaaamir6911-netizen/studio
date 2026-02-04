'use client';
import { ProductForm } from "@/components/seller/ProductForm";
import { db } from "@/lib/firebase/config";
import { Product } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound, useParams } from "next/navigation";


export default function EditProductPage() {
    const params = useParams();
    const { id } = params;

    const [product, loading, error] = useDocumentData(doc(db, 'products', id as string), { idField: 'id' });

    if(loading) {
        return <div className="container mx-auto px-4 py-8">
             <Skeleton className="h-10 w-1/4 mb-8" />
             <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
        </div>
    }

    if(!product && !loading) {
        notFound();
    }
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold font-headline mb-8">Edit Product</h1>
            {product && <ProductForm product={product as Product} />}
            {error && <p className="text-destructive">Error loading product.</p>}
        </div>
    );
}
