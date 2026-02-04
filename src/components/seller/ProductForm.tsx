'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Product } from '@/lib/types';
import { addProductAction, updateProductAction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '../ui/checkbox';
import { Trash } from 'lucide-react';
import { getAllSizes } from '@/lib/placeholder-data';

const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  images: z.array(z.string().url({ message: 'Please enter a valid image URL.' })).min(1, { message: 'At least one image is required.' }),
  sizes: z.array(z.string()).min(1, { message: 'At least one size must be selected.' }),
  colors: z.array(z.object({
    name: z.string().min(1, { message: 'Color name cannot be empty.' }),
    hex: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Must be a valid hex code.' }),
  })).min(1, { message: 'At least one color is required.' }),
  isFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const allSizes = getAllSizes();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? product : {
      name: '',
      description: '',
      price: 0,
      images: [''],
      sizes: [],
      colors: [{name: 'Black', hex: '#000000'}],
      isFeatured: false,
    },
  });
  
  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control: form.control, name: "images" });
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control: form.control, name: "colors" });

  async function onSubmit(data: ProductFormValues) {
    const result = product 
      ? await updateProductAction(product.id, data)
      : await addProductAction(data);

    if (result?.error) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Product ${product ? 'updated' : 'added'} successfully.` });
      router.push('/seller/dashboard');
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl><Input placeholder="e.g., Classic White Tee" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the product..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price ($)</FormLabel>
              <FormControl><Input type="number" placeholder="e.g., 29.99" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div>
          <FormLabel>Images</FormLabel>
          <FormDescription>Provide at least one image URL.</FormDescription>
           {imageFields.map((field, index) => (
             <FormField
                key={field.id}
                control={form.control}
                name={`images.${index}`}
                render={({ field }) => (
                    <FormItem className='flex items-center gap-2 mt-2'>
                        <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}><Trash/></Button>
                    </FormItem>
                )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendImage('')}>Add Image</Button>
          <FormMessage>{form.formState.errors.images?.message}</FormMessage>
        </div>
        
        <FormField
            control={form.control}
            name="sizes"
            render={() => (
                <FormItem>
                     <div className="mb-4">
                        <FormLabel>Sizes</FormLabel>
                        <FormDescription>Select all available sizes.</FormDescription>
                    </div>
                    <div className='grid grid-cols-4 gap-4'>
                    {allSizes.map(size => (
                        <FormField
                            key={size}
                            control={form.control}
                            name="sizes"
                            render={({ field }) => (
                                <FormItem key={size} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value?.includes(size)}
                                            onCheckedChange={(checked) => {
                                                return checked 
                                                    ? field.onChange([...field.value, size])
                                                    : field.onChange(field.value?.filter(v => v !== size))
                                            }}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">{size}</FormLabel>
                                </FormItem>
                            )}
                        />
                    ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />

        <div>
            <FormLabel>Colors</FormLabel>
            <FormDescription>Add names and hex codes for available colors.</FormDescription>
            {colorFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2 mt-2">
                    <FormField control={form.control} name={`colors.${index}.name`} render={({field}) => <FormItem><FormControl><Input placeholder="Color Name" {...field}/></FormControl></FormItem>} />
                    <FormField control={form.control} name={`colors.${index}.hex`} render={({field}) => <FormItem><FormControl><Input placeholder="#000000" {...field}/></FormControl></FormItem>} />
                    <div className="w-10 h-10 rounded" style={{ backgroundColor: form.watch(`colors.${index}.hex`) || '#fff', border: '1px solid #ccc' }}/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(index)}><Trash/></Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendColor({ name: '', hex: '' })}>Add Color</Button>
            <FormMessage>{form.formState.errors.colors?.message}</FormMessage>
        </div>
        
        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Featured Product</FormLabel>
                <FormDescription>Feature this product on the homepage.</FormDescription>
              </div>
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
        </Button>
      </form>
    </Form>
  );
}
