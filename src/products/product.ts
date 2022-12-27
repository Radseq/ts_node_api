import { CONFIG } from "../config";
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

export const getAllBestsellerProducts = async () => {
    const bestsellerMonthsPriorToToday = new Date();
    bestsellerMonthsPriorToToday.setMonth(bestsellerMonthsPriorToToday.getMonth() - CONFIG.LAST_MONTHS_PRODUCTS_IN_ORDER);

    const orderProducts = await prisma.orderProduct.findMany({
        where: {
            addDate: {
                gt: bestsellerMonthsPriorToToday
            }
        }
    });

    const soldProductsIds = orderProducts.filter(orderProduct => orderProduct.productId !== null)
        .map(orderProduct => orderProduct.id);

    const lastSoldProducts = await prisma.product.findMany({
        where: {
            id: {
                in: [...new Set(soldProductsIds)]
            },
        }
    });

    const prodIdWithSellCount = lastSoldProducts.map(product => [product.id, orderProducts
        .filter(filterProduct => filterProduct.productId === product.id).length]);

    const productsIds = prodIdWithSellCount.sort((a, b) => b[1] - a[1])
        .slice(0, CONFIG.MAX_BESTSELLS_PRODUCTS).map(aaa => aaa[0]);

    const result = lastSoldProducts.filter(product => {
        if (productsIds.includes(product.id))
            return product;
    });

    return result;
}