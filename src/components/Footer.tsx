import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerNavs = [
  { href: '/products', name: 'Products' },
  { href: '/orders', name: 'My Orders' },
  { href: '/wishlist', name: 'Wishlist' },
  { href: '#', name: 'About Us' },
  { href: '#', name: 'Contact' },
];

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-headline font-semibold">Rang Bazaar</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Modern fashion marketplace for clothing, jewellery, and accessories.
            </p>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold text-card-foreground">Quick Links</h3>
            <ul className="mt-4 grid grid-cols-2 gap-4">
              {footerNavs.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              Subscribe to our Newsletter
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get the latest updates on new products and upcoming sales.
            </p>
            <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rang Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
