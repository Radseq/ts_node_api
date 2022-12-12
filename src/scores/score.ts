import { ProductScore } from "@prisma/client";
import { prisma } from "../../prisma/prisma";

export const getProductScores = async (productId: number) => {
    const allProductScores = await prisma.productScore.findMany({
        where: {
            productId: productId
        }
    });

    return allProductScores;
}

export const sumProductVotesByScore = (productId: number, score: number, productScores: ProductScore[]) => {
    let count: number = 0;
    for (let index = 0; index < productScores.length; index++) {
        const productScore = productScores[index];
        if (productScore.score == score && productScore.productId === productId)
            ++count;
    }
    return count;
}
