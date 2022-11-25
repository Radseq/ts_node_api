import { receiveAllCategoriesByName } from "../categories/category"

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Motivation: take 3 max scored products of each category.
export const getAllRecommendedProducts = async (customerSearch: { value: string }[]) => {
    const categories = await receiveAllCategoriesByName(customerSearch.map(searchStringValue => searchStringValue.value));

    const sqlQuerys = categories.map(({ id }) => {
        return prisma.products.findMany({
            where: {
                productInCategories:
                {
                    some:
                    {
                        categoryId: id,
                    },
                },
            },
            orderBy: {
                scoreValue: 'desc',
            },
            distinct: ['id'],
            take: Number(process.env.MAX_PRODUCTS_PER_CATEGORY),
        });
    });

    let querysResult = new Array;

    await Promise.all(sqlQuerys).then((queryValues) => {
        querysResult = queryValues;
    });

    if (querysResult.length > Number(process.env.RECOMMENDED_PRODUCTS_MAX_SIZE)) {
        querysResult = querysResult.slice(0, Number(process.env.RECOMMENDED_PRODUCTS_MAX_SIZE))
    }
    return querysResult;
}