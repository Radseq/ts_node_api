import { getProductComments } from "../comments/comment";
import { getProductScores, sumProductVotesByScore } from "../scores/score";
import { prisma } from "../../prisma/prisma";
import { CONFIG } from "../config";
import { getSpecificationsByProductId } from "../specifications/specification";
import { getDescriptionsByProductId } from "../descriptions/description";
import { ProductScore, Specification } from "@prisma/client";

export const getAllProducts = async () => {
    const allProducts = await prisma.product.findMany();

    return allProducts;
}

export const getProductKeyValueVotes = (productId: number, productScoresDb: ProductScore[]) => {
    const votes: { [key: number]: number } = {};
    for (let scoreIndex = 0; scoreIndex < CONFIG.SCORES_MAX_SIZE; scoreIndex++) {
        votes[scoreIndex] = sumProductVotesByScore(productId, scoreIndex, productScoresDb)
    }
    return votes;
}

const getSpecificationRecords = (specifications: Specification[], mainType: boolean = false) => {
    const records: { [key: string]: string } = {};
    for (let index = 0; index < specifications.length; index++) {
        if (mainType === specifications[index].isMain) {
            records[specifications[index].name] = specifications[index].value;
        }
    }
    return records;
}

export const getProductById = async (productId: number) => {
    const foundProductById = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (foundProductById) {
        const commentPageIndex = 1;

        const [productScoresDb, productCommentsDb, productSpecificationsDb, productDescriptionDb]
            = await Promise.all(
                [getProductScores(productId),
                getProductComments(foundProductById.id, commentPageIndex, CONFIG.BASE_PRODUCT_COMMENTS_COUNT),
                getSpecificationsByProductId(productId),
                getDescriptionsByProductId(productId)]
            );

        return {
            product: foundProductById,
            specifications: {
                main: getSpecificationRecords(productSpecificationsDb, true),
                other: getSpecificationRecords(productSpecificationsDb)
            },
            descriptions: productDescriptionDb,
            comments: productCommentsDb,
            scores: getProductKeyValueVotes(productId, productScoresDb)
        }
    }

    return null;
}
