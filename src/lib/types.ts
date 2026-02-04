export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  isFeatured?: boolean;
  sellerId: string;
  createdAt?: any; // for firestore serverTimestamp
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string;
  color: { name: string; hex: string };
};

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string; // ISO string
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
};

export type AppUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: 'buyer' | 'seller';
};
