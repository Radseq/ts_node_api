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

const getMapProductIdWithSoldCount = (orderProducts: OrderProduct[]) => {
    let mapProductIdWithSoldCount = new Map<number, number>();

    for (const product of orderProducts) {
        mapProductIdWithSoldCount.set(product.id,
            orderProducts.filter(filterProduct => filterProduct.productId === product.id).length);
    }

    return mapProductIdWithSoldCount;
}

const getMostSoldProductsByDate = async (date: Date) => {
    const orderProducts = await getOrderProductsByDate(date);

    // todo really dont know what name put instead productKeyValue
    const productKeyValue = new Map([...getMapProductIdWithSoldCount(orderProducts).entries()].sort((a, b) => b[1] - a[1])
        .slice(0, CONFIG.MAX_BESTSELLS_PRODUCTS));

    const soldProductsIds = orderProducts.filter(orderProduct => orderProduct.productId !== null)
        .map(orderProduct => orderProduct.id);

    const products = await getProductsByIds(soldProductsIds);

    const result = products.filter(product => {
        if (productKeyValue.has(product.id))
            return product;
    });

    return result;
}

export const getAllBestsellerProducts = async () => {
    const bestsellerMonthsPriorToToday = new Date();
    bestsellerMonthsPriorToToday.setMonth(bestsellerMonthsPriorToToday.getMonth() - CONFIG.LAST_MONTHS_PRODUCTS_IN_ORDER);

    return getMostSoldProductsByDate(bestsellerMonthsPriorToToday);
}

export const getHitsOfWeekProducts = async () => {
    const hitsOfWeekData = new Date();
    hitsOfWeekData.setDate(hitsOfWeekData.getDate() - CONFIG.HITS_OF_WEEK_DAYS_PERIOD);
    return getMostSoldProductsByDate(hitsOfWeekData);
}