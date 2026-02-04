'use server';
import { aiSearchAssistance } from '@/ai/flows/ai-search-assistance';
import { virtualTryOn } from '@/ai/flows/virtual-try-on';
import { findImage } from '@/lib/placeholder-images';
import { revalidatePath } from 'next/cache';
import { db } from './firebase/config';
import { collection, addDoc, serverTimestamp, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase/config';
import type { Product } from './types';


export async function getAlternativeSearchTerms(
  searchTerm: string,
  prevState: any,
  formData: FormData
) {
  const productDescription = formData.get('productDescription') as string;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
    return { 
      alternativeSearchTerms: [], 
      error: 'The Gemini API key is missing. Please add it to your .env file. You can get a free key from Google AI Studio.' 
    };
  }

  if (!productDescription) {
    return { alternativeSearchTerms: [], error: null };
  }

  try {
    const result = await aiSearchAssistance({
      searchTerm,
      productDescription,
    });
    return { alternativeSearchTerms: result.alternativeSearchTerms || [], error: null };
  } catch (error) {
    console.error('AI search assistance failed:', error);
    return { 
      alternativeSearchTerms: [], 
      error: 'Failed to get AI suggestions. Please try again later.'
    };
  }
}

export async function handleVirtualTryOn(prevState: any, formData: FormData) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key') {
    return { tryOnImage: null, error: 'The Gemini API key is missing. Please add it to the .env file. You can get a free key from Google AI Studio.' };
  }
  
  const userImageDataUri = formData.get('userImage') as string;
  const productId = formData.get('productId') as string;
  
  if (!userImageDataUri) {
    return { tryOnImage: null, error: 'Please upload an image of yourself.' };
  }

  if (!productId) {
    return { tryOnImage: null, error: 'Product ID is missing.' };
  }

  const productRef = doc(db, "products", productId);
  const productDoc = await getDoc(productRef);

  if (!productDoc.exists()) {
    return { tryOnImage: null, error: 'Product not found.' };
  }
  const product = productDoc.data() as Product;

  const productImage = findImage(product.images[0]);
  if (!productImage && !product.images[0]?.startsWith('https')) {
    return { tryOnImage: null, error: 'Product image not found.' };
  }
  
  const imageUrl = productImage ? productImage.imageUrl : product.images[0];

  try {
    const result = await virtualTryOn({
      userImage: userImageDataUri,
      productImage: imageUrl,
    });
    return { tryOnImage: result.tryOnImage, error: null };
  } catch (error: any) {
    console.error('Virtual try-on failed:', error);
    return { tryOnImage: null, error: error.message || 'Failed to generate virtual try-on image.' };
  }
}

// Seller Product Actions

export async function addProductAction(productData: Omit<Product, 'id' | 'sellerId' | 'createdAt'>) {
    const user = auth.currentUser;
    if (!user) return { error: "You must be logged in to add a product." };

    try {
        await addDoc(collection(db, "products"), {
            ...productData,
            sellerId: user.uid,
            createdAt: serverTimestamp()
        });
        revalidatePath('/seller/dashboard');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to add product." };
    }
}

export async function updateProductAction(productId: string, productData: Partial<Product>) {
    const user = auth.currentUser;
    if (!user) return { error: "You must be logged in to update a product." };

    const productRef = doc(db, 'products', productId);
    // Add check to ensure user is the owner
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists() || productDoc.data().sellerId !== user.uid) {
        return { error: "Product not found or you don't have permission to edit it." };
    }

    try {
        await updateDoc(productRef, productData);
        revalidatePath('/seller/dashboard');
        revalidatePath(`/products/${productId}`);
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to update product." };
    }
}

export async function deleteProductAction(productId: string) {
    const user = auth.currentUser;
    if (!user) return { error: "You must be logged in to delete a product." };
    
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists() || productDoc.data().sellerId !== user.uid) {
        return { error: "Product not found or you don't have permission to delete it." };
    }

    try {
        await deleteDoc(productRef);
        revalidatePath('/seller/dashboard');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        return { error: error.message || "Failed to delete product." };
    }
}
