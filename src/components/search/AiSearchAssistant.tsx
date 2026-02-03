'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useFormState, useFormStatus } from 'react-dom';
import { getAlternativeSearchTerms } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const initialState = {
  alternativeSearchTerms: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Thinking...' : 'Get Suggestions'}
    </Button>
  );
}

export function AiSearchAssistant({ searchTerm }: { searchTerm: string }) {
  const [description, setDescription] = useState('');
  const getTermsWithSearchTerm = getAlternativeSearchTerms.bind(null, searchTerm);
  const [state, formAction] = useFormState(getTermsWithSearchTerm, initialState);

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline">AI Search Assistant</CardTitle>
        <CardDescription>
          Can't find what you're looking for? Describe the item, and our AI will suggest other things to search for.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <Textarea
            name="productDescription"
            placeholder="e.g., 'A long, flowy red dress with gold embroidery, perfect for a wedding.'"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
          <SubmitButton />
        </form>
        {state.alternativeSearchTerms && state.alternativeSearchTerms.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Try searching for:</h4>
            <div className="flex flex-wrap gap-2">
              {state.alternativeSearchTerms.map((term, index) => (
                <Badge key={index} variant="secondary" className="text-base">
                  <Link href={`/search?q=${term}`}>{term}</Link>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
