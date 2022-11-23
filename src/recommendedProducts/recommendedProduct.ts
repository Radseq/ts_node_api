import { categoriesByNameRelatedToProducts } from "../categories/category"
import { Prisma } from '@prisma/client'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Motivation: take 3 max scored products of each category.
export const getAllRecommendedProducts = async (customerSearch: { value: string }[]) => {
    const categories = await categoriesByNameRelatedToProducts(customerSearch.map(searchStringValue => searchStringValue.value));

    const products = await prisma.products.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            imageSrc: true,
            price: true,
            vat: true,
            discountPrice: true,
            hasFreeShipping: true,
            isBestseller: true,
            productsCategories:
            {
                take: 3,
            },
        },
        where: {
            productsCategories:
            {
                some:
                {
                    categoryId: { in: categories.map(({ id }) => id) },
                },
            },
        },
        orderBy: {
            scoreValue: 'desc',
        },
        distinct: ['id'],
        take: Number(process.env.RECOMMENDED_PRODUCTS_MAX_SIZE),
    }) as [];

    return products;
}
