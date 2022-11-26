import { CONFIG } from "../config";
import { retrieveAllCategoriesByName } from "../categories/category"

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Motivation: take 3 max scored products of each category.
export const getAllRecommendedProducts = async (customerSearch: { value: string }[]) => {
    const categories = await retrieveAllCategoriesByName(customerSearch.map(searchStringValue => searchStringValue.value));

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
            take: CONFIG.MAX_PRODUCTS_PER_CATEGORY,
        });
    });

    let querysResult = await Promise.all(sqlQuerys);

    // since sqlQuerys return array in array, we flat this into one array
    querysResult = querysResult.slice(0, CONFIG.MAX_RECOMMENDED_PRODUCTS).flat();

    if (querysResult.length < CONFIG.MAX_RECOMMENDED_PRODUCTS) {
        // we don't have proper amount of products, we just take most scored products overall
        // todo take best scored products sold in last ... days
        const products = await prisma.products.findMany({
            where: {
                NOT:
                {
                    id: { in: querysResult.map(({ id }) => id) },
                },
            },
            orderBy: {
                scoreValue: 'desc',
            },
            take: Number(querysResult.length - CONFIG.MAX_RECOMMENDED_PRODUCTS),
        }) as [];
        querysResult = querysResult.concat(products);
    }
    console.log(querysResult);
    return querysResult;
}