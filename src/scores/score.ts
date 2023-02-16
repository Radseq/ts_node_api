import { ProductScore } from "@prisma/client";
import { prisma } from "../../prisma/prisma";

export const getProductScores = async (productId: number) => {
	const allProductScores = await prisma.productScore.findMany({
		where: {
			productId: productId,
		},
	});

	return allProductScores;
};

export const sumProductVotesByScore = (
	productId: number,
	scoreIndex: number,
	productScores: ProductScore[]
) => {
	return productScores.filter(
		(score) => score.score == scoreIndex && score.productId == productId
	).length;
};
