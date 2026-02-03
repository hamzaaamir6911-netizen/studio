'use server';
import { aiSearchAssistance } from '@/ai/flows/ai-search-assistance';

export async function getAlternativeSearchTerms(
  searchTerm: string,
  prevState: any,
  formData: FormData
) {
  const productDescription = formData.get('productDescription') as string;

  if (!productDescription) {
    return { alternativeSearchTerms: [] };
  }

  try {
    const result = await aiSearchAssistance({
      searchTerm,
      productDescription,
    });
    return { alternativeSearchTerms: result.alternativeSearchTerms || [] };
  } catch (error) {
    console.error('AI search assistance failed:', error);
    return { alternativeSearchTerms: [] };
  }
}
