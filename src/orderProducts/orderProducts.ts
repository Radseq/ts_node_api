import { prisma } from "../../prisma/prisma";

export const getOrderProductsByDate = async (date: Date) => {
    const orderProducts = await prisma.orderProduct.findMany({
        where: {
            addDate: {
                gt: date
            }
        }
    });

   return orderProducts;
}