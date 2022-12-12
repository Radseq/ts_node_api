import { getProductComments } from "../comments/comment";
import { getProductScores, sumProductVotesByScore } from "../scores/score";
import { prisma } from "../../prisma/prisma";
import { CONFIG } from "../config";

type productScore = {
    value: number,
    voteCount: number
}

export const getAllProducts = async () => {
    const allProducts = await prisma.product.findMany();

    return allProducts;
}

export const getProductById = async (productId: number) => {
    const productDb = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            productSpecification: {
                include: {
                    specification: true
                }
            },
            productDescription: {
                include: {
                    description: true
                }
            }
        }
    });

    if (productDb) {
        const productScoresDb = await getProductScores(productId);

        let productScores: productScore[] = [];

        for (let index = 1; index <= CONFIG.SCORES_MAX_SIZE; index++) {
            productScores.push(
                {
                    value: index,
                    voteCount: sumProductVotesByScore(productId, index, productScoresDb)
                });
        }
        const commentPageIndex = 1;
        var productComments = await getProductComments(productDb?.id, commentPageIndex, CONFIG.BASE_PRODUCT_COMMENTS_COUNT);

        return { product: productDb, comments: productComments, scores: productScores }
    }
    return null;
}
