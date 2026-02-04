import type { Product } from './types';


export function getAllProducts(): Product[] {
    // This function is now obsolete. Data should be fetched from Firestore.
    return [];
}

export function getProductById(id: string): Product | undefined {
    // This function is now obsolete.
    return undefined;
}

export function getFeaturedProducts(): Product[] {
     // This function is now obsolete.
    return [];
}

export function getAllCategories() {
    // This function is now obsolete.
    return [];
}

export function getRelatedProducts(productId: string, category: string): Product[] {
    // This function is now obsolete.
    return [];
}

export function getAllSizes(): string[] {
    // For now, we will keep sizes hardcoded. In a real app, this could
    // be fetched from products in Firestore.
    const allSizes = [
        'S', 'M', 'L', 'XL', 'XXL',
        '30', '32', '34', '36',
    ];
    const uniqueSizes = [...new Set(allSizes)];
    uniqueSizes.sort((a, b) => {
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
