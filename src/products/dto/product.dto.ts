export type ProductDto = {
    id: string;
    name: string;
    imageSrc: string;
    price: number;
    vat: number;
    quantity: number;
    discountPrice?: number;
    description?: string;
}