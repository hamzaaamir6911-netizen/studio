import type { Product, Category } from './types';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Azure Bloom Embroidered Kurta',
    description: 'A stunning azure blue kurta crafted from premium lawn fabric, featuring intricate floral embroidery on the neckline and sleeves. Perfect for daytime events.',
    price: 120.00,
    images: ['prod1_img1', 'prod1_img2'],
    category: 'Clothing',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Azure', hex: '#007FFF' }, { name: 'Ivory', hex: '#FFFFF0' }],
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Chandbali Pearl Earrings',
    description: 'Elegant and traditional Chandbali earrings, gold-plated and adorned with delicate pearls and a central kundan stone. A timeless piece for any celebration.',
    price: 65.00,
    images: ['prod2_img1'],
    category: 'Jewelry',
    sizes: ['One Size'],
    colors: [{ name: 'Gold', hex: '#FFD700' }],
  },
  {
    id: '3',
    name: 'Royal Brocade Waistcoat',
    description: "A men's waistcoat made from rich brocade fabric with a classic jamawar pattern. Features a mandarin collar and concealed buttons for a sharp, formal look.",
    price: 150.00,
    images: ['prod3_img1'],
    category: 'Clothing',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Maroon', hex: '#800000' }, { name: 'Navy', hex: '#000080' }],
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Kashmiri Pashmina Shawl',
    description: 'An exquisitely soft pashmina shawl from Kashmir, handwoven with intricate paisley patterns. A luxurious accessory that offers both warmth and style.',
    price: 250.00,
    images: ['prod4_img1'],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [{ name: 'Beige', hex: '#F5F5DC' }],
  },
  {
    id: '5',
    name: 'Embellished Khussa Shoes',
    description: 'Handcrafted traditional Khussa shoes made from genuine leather, featuring intricate tilla and beadwork. The soft, padded insole ensures comfort.',
    price: 75.00,
    images: ['prod5_img1'],
    category: 'Accessories',
    sizes: ['6', '7', '8', '9'],
    colors: [{ name: 'Tan', hex: '#D2B48C' }],
  },
  {
    id: '6',
    name: 'Gulnaar Printed Lawn Suit',
    description: 'A vibrant 3-piece lawn suit with a digitally printed floral design, paired with a chiffon dupatta and solid-color trousers. Ideal for summer wear.',
    price: 95.00,
    images: ['prod6_img1'],
    category: 'Clothing',
    sizes: ['S', 'M', 'L'],
    colors: [{ name: 'Multi', hex: '#FFFFFF' }],
    isFeatured: true,
  },
  {
    id: '7',
    name: 'Lapis Lazuli Silver Choker',
    description: 'A statement choker necklace handcrafted from sterling silver, featuring stunning lapis lazuli stones set in a traditional design.',
    price: 180.00,
    images: ['prod7_img1'],
    category: 'Jewelry',
    sizes: ['One Size'],
    colors: [{ name: 'Silver', hex: '#C0C0C0' }],
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Classic Structured Handbag',
    description: 'A chic and minimalist handbag crafted from high-quality faux leather. Its structured design and gold-tone hardware make it a versatile accessory for any outfit.',
    price: 85.00,
    images: ['prod8_img1'],
    category: 'Accessories',
    sizes: ['One Size'],
    colors: [{ name: 'Taupe', hex: '#483C32' }],
  },
  {
    id: '9',
    name: 'Charcoal Bandhgala Jacket',
    description: "A modern take on the classic Bandhgala, tailored for a slim fit in a premium charcoal grey fabric. Perfect for formal events and weddings.",
    price: 220.00,
    images: ['prod9_img1'],
    category: 'Clothing',
    sizes: ['M', 'L', 'XL'],
    colors: [{ name: 'Charcoal', hex: '#36454F' }],
  },
  {
    id: '10',
    name: 'Pastel Pink Chiffon Sari',
    description: 'A graceful chiffon sari in a delicate pastel pink hue, featuring a lightly embroidered border and a matching unstitched blouse piece.',
    price: 190.00,
    images: ['prod10_img1'],
    category: 'Clothing',
    sizes: ['One Size'],
    colors: [{ name: 'Pastel Pink', hex: '#FFD1DC' }],
  },
  {
    id: '11',
    name: 'Meenakari Enamel Bangles',
    description: 'A set of four vibrant bangles with traditional Meenakari (enamel) work, perfect for adding a pop of color to your ethnic wear.',
    price: 45.00,
    images: ['prod11_img1'],
    category: 'Jewelry',
    sizes: ['2.4', '2.6', '2.8'],
    colors: [{ name: 'Multi', hex: '#FFFFFF' }],
    isFeatured: true,
  },
  {
    id: '12',
    name: 'Ivory White Linen Trousers',
    description: 'Classic straight-fit trousers for men, made from breathable and comfortable linen fabric. A versatile staple for any wardrobe.',
    price: 60.00,
    images: ['prod12_img1'],
    category: 'Clothing',
    sizes: ['30', '32', '34', '36'],
    colors: [{ name: 'Ivory', hex: '#FFFFF0' }],
  },
];

const CATEGORIES: Category[] = [
    { id: '1', name: 'Clothing', image: 'cat_clothing' },
    { id: '2', name: 'Jewelry', image: 'cat_jewelry' },
    { id: '3', name: 'Accessories', image: 'cat_accessories' },
];

export function getAllProducts(): Product[] {
    return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
    return PRODUCTS.find(p => p.id === id);
}

export function getFeaturedProducts(): Product[] {
    return PRODUCTS.filter(p => p.isFeatured);
}

export function getAllCategories(): Category[] {
    return CATEGORIES;
}

export function getRelatedProducts(productId: string, category: string): Product[] {
    return PRODUCTS.filter(p => p.category === category && p.id !== productId).slice(0, 4);
}

export function getAllSizes(): string[] {
    const allSizes = PRODUCTS.flatMap(p => p.sizes);
    const uniqueSizes = [...new Set(allSizes)];
    uniqueSizes.sort((a, b) => {
        if (a === 'One Size') return 1;
        if (b === 'One Size') return -1;
        const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
        const aIndex = sizeOrder.indexOf(a);
        const bIndex = sizeOrder.indexOf(b);

        if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;

        return a.localeCompare(b, undefined, { numeric: true });
    });
    return uniqueSizes;
}
