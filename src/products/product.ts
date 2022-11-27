const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export const getAllProducts = async () => {
    const allProducts = await prisma.Product.findMany();

    return allProducts;
}

export const getProductById = async (productId: number) => {
    const product = await prisma.Product.findUnique({
        where: { id: productId }
    })

    return product;
}
