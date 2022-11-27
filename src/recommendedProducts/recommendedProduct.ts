import { CONFIG } from "../config";
import { retrieveAllCategories, retrieveAllCategoriesByName } from "../categories/category"

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Motivation: take 3 max scored products of each category.
export const getAllRecommendedProducts = async (customerSearch: { value: string }[]) => {
    let categories = await retrieveAllCategoriesByName(customerSearch.map(searchStringValue => searchStringValue.value));
    if (!categories?.length) {
        categories = await retrieveAllCategories();
    }

    const sqlQuerys = categories.map(({ id }: { id: number; }) => {
        return prisma.product.findMany({
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

    let recommendedProducts = await Promise.all(sqlQuerys);

    // since sqlQuerys return array in array, we flat this into one array
    recommendedProducts = recommendedProducts.flat().slice(0, CONFIG.MAX_RECOMMENDED_PRODUCTS);

    if (recommendedProducts.length < CONFIG.MAX_RECOMMENDED_PRODUCTS) {
        // we don't have proper amount of products, we just take most scored products overall
        // todo take best scored products sold in last ... days
        const products = await prisma.product.findMany({
            where: {
                NOT:
                {
                    id: { in: recommendedProducts.map(({ id }) => id) },
                },
            },
            orderBy: {
                scoreValue: 'desc',
            },
            take: recommendedProducts.length - CONFIG.MAX_RECOMMENDED_PRODUCTS,
        });
        recommendedProducts = recommendedProducts.concat(products);
    }

    return recommendedProducts;
}