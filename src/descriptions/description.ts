import { prisma } from "../../prisma/prisma";

export const getDescriptionsByProductId = async (productId: number) => {
    const allDescriptions = await prisma.description.findMany({
        where: {
            productDescription: {
                some: {
                    productId: productId
                }
            },
        }
    });

    return allDescriptions;
}