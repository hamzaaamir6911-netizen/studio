'use client';

import Link from 'next/link';
import { Search, ShoppingBag, Heart, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { UserNav } from './UserNav';
import { MobileNav } from './MobileNav';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';

const navLinks = [
  { href: '/products', label: 'All Products' },
  { href: '/products?category=clothing', label: 'Clothing' },
  { href: '/products?category=jewelry', label: 'Jewelry' },
  { href: '/products?category=accessories', label: 'Accessories' },
];

export function Header() {
  const { items: cartItems } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center">
        <div className="md:hidden mr-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl font-headline">Rang Bazaar</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden lg:flex flex-1 mx-8 max-w-sm">
             <form onSubmit={handleSearch} className="w-full relative">
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             </form>
          </div>
          
          <UserNav />

          <Link href="/wishlist" aria-label="Wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-6 w-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Button>
          </Link>

          <Link href="/cart" aria-label="Shopping Cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-foreground transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
      <MobileNav
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        navLinks={navLinks}
      />
    </header>
  );
}
