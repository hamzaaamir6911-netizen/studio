'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type MobileNavProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navLinks: { href: string; label: string }[];
};

export function MobileNav({ isOpen, setIsOpen, navLinks }: MobileNavProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${searchQuery}`);
        }
    };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">
            Rang Bazaar
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
             <form onSubmit={handleSearch} className="w-full relative mb-4">
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             </form>
          <nav className="grid gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
