import { prisma } from "../../prisma/prisma";

export const getSpecificationsByProductId = async (productId: number) => {
    const allSpecifications = await prisma.specification.findMany({
        where: {
            productSpecification: {
                some: {
                    productId: productId
                }
            },
        }
    });

    return allSpecifications;
}