'use server';

/**
 * @fileOverview Implements AI-driven alternative search results for fashion items.
 *
 * - aiSearchAssistance - A function that provides alternative search results based on product description.
 * - AISearchAssistanceInput - The input type for the aiSearchAssistance function.
 * - AISearchAssistanceOutput - The return type for the aiSearchAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISearchAssistanceInputSchema = z.object({
  searchTerm: z.string().describe('The original search term entered by the user.'),
  productDescription: z.string().describe('A detailed description of the desired product.'),
});
export type AISearchAssistanceInput = z.infer<typeof AISearchAssistanceInputSchema>;

const AISearchAssistanceOutputSchema = z.object({
  alternativeSearchTerms: z
    .array(z.string())
    .describe('A list of alternative search terms to find relevant products.'),
});
export type AISearchAssistanceOutput = z.infer<typeof AISearchAssistanceOutputSchema>;

export async function aiSearchAssistance(input: AISearchAssistanceInput): Promise<AISearchAssistanceOutput> {
  return aiSearchAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSearchAssistancePrompt',
  input: {schema: AISearchAssistanceInputSchema},
  output: {schema: AISearchAssistanceOutputSchema},
  prompt: `The user is searching for a fashion item but is not finding satisfactory results. The original search term was "{{searchTerm}}".

The user provided the following description of the product they are looking for: "{{productDescription}}".

Based on this description, suggest 3-5 alternative search terms that the user could try to find relevant products. Return the terms as a JSON array of strings.`,
});

const aiSearchAssistanceFlow = ai.defineFlow(
  {
    name: 'aiSearchAssistanceFlow',
    inputSchema: AISearchAssistanceInputSchema,
    outputSchema: AISearchAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
