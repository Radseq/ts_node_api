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
