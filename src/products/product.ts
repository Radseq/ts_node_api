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
                in: soldProductsIds
            },
        }
    });

    let mapProductIdWithSoldCount = new Map<number, number>();

    for (const product of orderProducts) {
        mapProductIdWithSoldCount.set(product.id,
            orderProducts.filter(filterProduct => filterProduct.productId === product.id).length);
    }

    // todo really dont know what name put instead productKeyValue
    const productKeyValue = new Map([...mapProductIdWithSoldCount.entries()].sort((a, b) => b[1] - a[1])
        .slice(0, CONFIG.MAX_BESTSELLS_PRODUCTS));

    const result = lastSoldProducts.filter(product => {
        if (productKeyValue.has(product.id))
            return product;
    });

    return result;
}