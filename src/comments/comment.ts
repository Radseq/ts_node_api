import { prisma } from "../../prisma/prisma";

export const getProductComments = async (productId: number, pageIndex: number, pageSize: number) => {

    const comments = await prisma.productComment.findMany({
        where: {
            productId: productId
        },
        include: {
            productScore: true
        },
        skip: (pageIndex * pageSize) - pageSize,
        take: pageSize,
    });

    return comments;
}