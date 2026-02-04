'use server';
import { aiSearchAssistance } from '@/ai/flows/ai-search-assistance';
import { virtualTryOn } from '@/ai/flows/virtual-try-on';
import { getProductById } from '@/lib/placeholder-data';
import { findImage } from '@/lib/placeholder-images';

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

  const product = getProductById(productId);
  if (!product) {
    return { tryOnImage: null, error: 'Product not found.' };
  }

  const productImage = findImage(product.images[0]);
  if (!productImage) {
    return { tryOnImage: null, error: 'Product image not found.' };
  }

  try {
    const result = await virtualTryOn({
      userImage: userImageDataUri,
      productImage: productImage.imageUrl,
    });
    return { tryOnImage: result.tryOnImage, error: null };
  } catch (error: any) {
    console.error('Virtual try-on failed:', error);
    return { tryOnImage: null, error: error.message || 'Failed to generate virtual try-on image.' };
  }
}
