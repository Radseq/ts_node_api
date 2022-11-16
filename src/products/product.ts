const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

export const getAllProducts = async () => {
    const allProducts = await prisma.Products.findMany();

    console.log(allProducts);
    return allProducts;
}

export const getProductById = async (productId: number) => {
    const product = await prisma.Products.findUnique({
        where: { id: productId }
    })

    console.log(product);
    return Promise.resolve(product)
}
