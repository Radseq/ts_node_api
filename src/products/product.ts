import { CONFIG } from "../config";
import { prisma } from "../../prisma/prisma";
import { getOrderProductsByDate } from "../orderProducts/orderProducts";
import { OrderProduct } from "@prisma/client";

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

export const getProductsByIds = async (productIds: number[]) => {
    const product = await prisma.product.findMany({
        where: {
            id: {
                in: productIds
            },
        }
    })

    return product;
}

const getMostSoldProductsByDate = async (date: Date) => {
    const orderProducts = await getOrderProductsByDate(date);

    const productIdSoldCountMap = new Map(orderProducts.map(i => [i.productId, orderProducts.filter(filterProduct => filterProduct.productId === i.productId).length]));
    const getProductsIdsOfSortMap = [...productIdSoldCountMap.entries()].sort((a, b) => b[1] - a[1]).map(keyValue => keyValue[0]);

    const slicedMap = getProductsIdsOfSortMap.slice(0, CONFIG.MAX_BESTSELLS_PRODUCTS);

    const products = await getProductsByIds(slicedMap as number[]);

    return products;
}

export const getAllBestsellerProducts = async () => {
    const bestsellerMonthsPriorToToday = new Date();
    bestsellerMonthsPriorToToday.setMonth(bestsellerMonthsPriorToToday.getMonth() - CONFIG.LAST_MONTHS_PRODUCTS_IN_ORDER);

    return getMostSoldProductsByDate(bestsellerMonthsPriorToToday);
}