import { getProductComments } from "../comments/comment";
import { getProductScores, sumProductVotesByScore } from "../scores/score";
import { prisma } from "../../prisma/prisma";
import { getOrderProductsByDate } from "../orderProducts/orderProducts";
import { CONFIG } from "../config";
import { getSpecificationsByProductId } from "../specifications/specification";
import { getDescriptionsByProductId } from "../descriptions/description";
import { ProductScore, Specification } from "@prisma/client";

export const getAllProducts = async () => {
	const allProducts = await prisma.product.findMany();

	return allProducts;
};

export const getProductsByIds = async (productIds: number[]) => {
	const product = await prisma.product.findMany({
		where: {
			id: {
				in: productIds,
			},
		},
	});

	return product;
};

const getMostSoldProductsByDate = async (date: Date) => {
	const orderProducts = await getOrderProductsByDate(date);

	// create Map with product id and product sold count
	const productIdSoldCountMap = new Map(
		orderProducts.map((orderProduct) => [
			orderProduct.productId,
			orderProducts.filter(
				(filterProduct) =>
					filterProduct.productId === orderProduct.productId
			).length,
		])
	);

	// get product id array of sorted map by product sold count desc
	const getProductsIdsOfSortMap = [...productIdSoldCountMap.entries()]
		.sort((a, b) => b[1] - a[1])
		.map((keyValue) => keyValue[0]);

	const sliceProductsIds = getProductsIdsOfSortMap.slice(
		0,
		CONFIG.MAX_BESTSELLS_PRODUCTS
	);

	const products = await getProductsByIds(sliceProductsIds as number[]);

	return products;
};

export const getAllBestsellerProducts = async () => {
	const bestsellerMonthsPriorToToday = new Date();
	bestsellerMonthsPriorToToday.setMonth(
		bestsellerMonthsPriorToToday.getMonth() -
			CONFIG.LAST_MONTHS_PRODUCTS_IN_ORDER
	);

	return getMostSoldProductsByDate(bestsellerMonthsPriorToToday);
};

export const getProductKeyValueVotes = (
	productId: number,
	productScoresDb: ProductScore[]
) => {
	const votes: Record<number, number> = {};
	for (
		let scoreIndex = 0;
		scoreIndex < CONFIG.SCORES_MAX_SIZE;
		scoreIndex++
	) {
		votes[scoreIndex] = sumProductVotesByScore(
			productId,
			scoreIndex,
			productScoresDb
		);
	}
	return votes;
};

const getSpecificationRecords = (
	specifications: Specification[],
	mainType: boolean = false
) => {
	const records: Record<string, string> = {};
	for (let index = 0; index < specifications.length; index++) {
		if (mainType === specifications[index].isMain) {
			records[specifications[index].name] = specifications[index].value;
		}
	}
	return records;
};

export const getProductById = async (productId: number) => {
	const foundProductById = await prisma.product.findUnique({
		where: { id: productId },
	});

	if (!foundProductById) return null;

	const commentPageIndex = 1;

	const [
		productScoresDb,
		productCommentsDb,
		productSpecificationsDb,
		productDescriptionDb,
	] = await Promise.all([
		getProductScores(productId),
		getProductComments(
			foundProductById.id,
			commentPageIndex,
			CONFIG.BASE_PRODUCT_COMMENTS_COUNT
		),
		getSpecificationsByProductId(productId),
		getDescriptionsByProductId(productId),
	]);

	return {
		product: foundProductById,
		specifications: {
			main: getSpecificationRecords(productSpecificationsDb, true),
			other: getSpecificationRecords(productSpecificationsDb),
		},
		descriptions: productDescriptionDb,
		comments: productCommentsDb,
		scores: getProductKeyValueVotes(productId, productScoresDb),
	};
};

export const getProductsByName = async (productName: string) => {
	const allSearchProductsByName = await prisma.product.findMany({
		select: {
			id: true,
			name: true,
			price: true,
		},
		where: {
			name: {
				contains: productName,
			},
		},
		take: CONFIG.MAX_SEARCH_RESULT,
	});

	return allSearchProductsByName;
};
