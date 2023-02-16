import { CONFIG } from "../config";
import { prisma } from "../../prisma/prisma";

export const getAllProducts = async () => {
    const allProducts = await prisma.product.findMany();

    return allProducts;
}

export const getProductById = async (productId: number) => {
    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    return product;
}

export const getProductsByName = async (productName: string) => {
    const allSearchProductsByName = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true
        },
        where: {
            name: {
                contains: productName
            }
        },
        take: CONFIG.MAX_SEARCH_RESULT
    });

    return allSearchProductsByName;
}