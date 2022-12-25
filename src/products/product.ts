import { getProductComments } from "../comments/comment";
import { getProductScores, sumProductVotesByScore } from "../scores/score";
import { prisma } from "../../prisma/prisma";
import { CONFIG } from "../config";
import { getSpecificationsByProductId } from "../specifications/specification";
import { getDescriptionsByProductId } from "../descriptions/description";
import { ProductScore } from "@prisma/client";

export const getAllProducts = async () => {
    const allProducts = await prisma.product.findMany();

    return allProducts;
}

export const getProductKeyValueVotes = (productId: number, productScoresDb: ProductScore[]) => {
    // create array then push objects
    const votes = Array.from(Array(CONFIG.SCORES_MAX_SIZE).keys()).map(scoreIndex => {
        return {
            value: scoreIndex,
            voteCount: sumProductVotesByScore(productId, scoreIndex, productScoresDb)
        }
    })
    // parse array of name and valueCount into keyValues
    const keyValues = Object.assign({}, ...votes.map(score => ({ [score.value]: score.voteCount })));

    return keyValues;
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


        return {
            product: productDb,
            specifications: productSpecificationsDb,
            descriptions: productDescriptionDb,
            comments: productCommentsDb,
            scores: getProductKeyValueVotes(productId, productScoresDb)
        }
    }

    return null;
}
