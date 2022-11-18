const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const jsonToRecommendedProduct = (
    json: {
        id: number,
        name: string,
        description: string,
        imageSrc: string,
        price: number,
        vat: number,
        promotionPrice: number,
        discountPrice: number,
        hasFreeShipping: boolean,
        isBestseller: boolean
    }
) => {
    return {
        id: json.id,
        name: json.name,
        description: json.description,
        imageSrc: json.imageSrc,
        price: json.price,
        vat: json.price,
        promotionPrice: json.discountPrice,
        category: {
            freeShipping: json.hasFreeShipping ?? false,
            bestseller: json.isBestseller ?? false
        }
    }
}

export const getAllRecommendedProducts = async () => {
    const allProducts = await prisma.Products.findMany() as [];

    return allProducts.map(json => {
        return jsonToRecommendedProduct(json);
    });
}

export const getRecommendedProductById = async (productId: number) => {
    const product = await prisma.Products.findUnique({
        where: { id: productId }
    });

    return jsonToRecommendedProduct(product);
}
