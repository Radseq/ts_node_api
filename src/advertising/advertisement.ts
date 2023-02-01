import { prisma } from "../../prisma/prisma";

export const getAllAdvertisements = async () => {
    const allAdvertising = await prisma.advertisement.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            imageSrc: true
        },
        where: {
            expiredDate: {
                gte: new Date()
            }
        }
    });

    return allAdvertising;
}