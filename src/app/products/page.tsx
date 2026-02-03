'use client';

import { useState, useMemo } from 'react';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { getAllProducts, getAllCategories, getAllSizes } from '@/lib/placeholder-data';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { ListFilter } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function ProductsPage() {
  const allProducts = useMemo(() => getAllProducts(), []);
  const allCategories = useMemo(() => getAllCategories(), []);
  const allSizes = useMemo(() => getAllSizes(), []);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [category, setCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([500]);
  const [sort, setSort] = useState('featured');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const maxPrice = useMemo(() => Math.max(...allProducts.map(p => p.price)), [allProducts]);
  
  const applyFilters = () => {
    let products = [...allProducts];

    // Filter by category
    if (category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    
    // Filter by size
    if (selectedSizes.length > 0) {
      products = products.filter(p => p.sizes.some(size => selectedSizes.includes(size)));
    }

    // Filter by price
    products = products.filter(p => p.price <= priceRange[0]);

    // Sort
    if (sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === 'featured') {
      products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    setFilteredProducts(products);
  };

  const handleClear = () => {
    setCategory('all');
    setPriceRange([maxPrice]);
    setSort('featured');
    setSelectedSizes([]);
    setFilteredProducts(allProducts);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline">All Products</h1>
        <p className="mt-2 text-lg text-muted-foreground">Discover your next favorite piece from our collection.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 lg:w-72">
          <CardWithApplyingFilters title='Filters' onApply={applyFilters} onClear={handleClear}>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {category === 'all' ? 'All Categories' : allCategories.find(c => c.name.toLowerCase() === category)?.name}
                      <ListFilter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                      <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                      {allCategories.map(cat => (
                        <DropdownMenuRadioItem key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Size</h3>
                <div className="grid grid-cols-3 gap-y-2 gap-x-4">
                  {allSizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={(checked) => {
                          setSelectedSizes(prev => 
                            checked ? [...prev, size] : prev.filter(s => s !== size)
                          );
                        }}
                      />
                      <Label htmlFor={`size-${size}`} className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Max Price: ${priceRange[0]}</h3>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={maxPrice}
                  step={10}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {sort === 'featured' ? 'Featured' : sort === 'price-asc' ? 'Price: Low to High' : 'Price: High to Low'}
                      <ListFilter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                      <DropdownMenuRadioItem value="featured">Featured</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-asc">Price: Low to High</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="price-desc">Price: High to Low</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardWithApplyingFilters>
        </aside>

        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No products match your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function CardWithApplyingFilters({ title, children, onApply, onClear }: { title: string, children: React.ReactNode, onApply: () => void, onClear: () => void }) {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
      <div className="flex gap-2 mt-6">
        <Button onClick={onApply} className="w-full">Apply</Button>
        <Button onClick={onClear} variant="ghost" className="w-full">Clear</Button>
      </div>
    </div>
  )
}
