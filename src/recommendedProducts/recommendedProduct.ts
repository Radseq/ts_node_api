import { CONFIG } from "../config";
import { retrieveAllCategories, retrieveAllCategoriesByName } from "../categories/category"
import { prisma } from "../../prisma/prisma";


export const retrieveOneRecommendedProductsOfCategories = async (categoriesIds: number[]) => {
    const result = await prisma.product.findMany({
        where: {
            id: { in: categoriesIds },
        },
        orderBy: {
            scoreValue: 'desc',
        },
        take: 1,
    })
    return result;
}

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

    const queryResultPromises = await Promise.all(sqlQuerys);

    let recommendedProducts = queryResultPromises.flat().slice(0, CONFIG.MAX_RECOMMENDED_PRODUCTS);
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