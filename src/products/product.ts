import { getProductComments } from "../comments/comment";
import { getProductScores, sumProductVotesByScore } from "../scores/score";
import { prisma } from "../../prisma/prisma";
import { CONFIG } from "../config";
import { getSpecificationsByProductId } from "../specifications/specification";
import { getDescriptionsByProductId } from "../descriptions/description";

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
        where: { id: productId }
    });

    if (productDb) {
        const commentPageIndex = 1;
        const productScoresDbLoading = getProductScores(productId);
        const productCommentsLoading = getProductComments(productDb?.id, commentPageIndex, CONFIG.BASE_PRODUCT_COMMENTS_COUNT);

        const productSpecificationsLoading = getSpecificationsByProductId(productId);
        const productDescriptionLoading = getDescriptionsByProductId(productId);

        const [productScoresDb, productCommentsDb, productSpecificationsDb, productDescriptionDb] = await Promise.all([productScoresDbLoading,
            productCommentsLoading,
            productSpecificationsLoading,
            productDescriptionLoading]);

        let productScores: productScore[] = [];

        for (let index = 1; index <= CONFIG.SCORES_MAX_SIZE; index++) {
            productScores.push(
                {
                    value: index,
                    voteCount: sumProductVotesByScore(productId, index, productScoresDb)
                });
        }

        return {
            product: productDb,
            specifications: productSpecificationsDb,
            descriptions: productDescriptionDb,
            comments: productCommentsDb,
            scores: productScores
        }
    }

    return null;
}
