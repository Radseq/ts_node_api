import { getOrderProductByDateRange } from "../orderProducts/orderProducts";
import { prisma } from "../../prisma/prisma";
import { CONFIG } from "../config";

const getProductSoldQuantity = async (
	dateFrom: Date,
	dateTo: Date,
	productId: number
) => {
	const ordersProduct = await getOrderProductByDateRange(
		dateFrom,
		dateTo,
		productId
	);

	if (ordersProduct.length === 0) return 0;

	const quantityArray = ordersProduct.map(
		(ordersProduct) => ordersProduct.quantity
	);

	const sumQuantity = quantityArray.reduce(
		(accumulator, currentValue) => accumulator + currentValue
	);

	return sumQuantity;
};

export const getHotSellProduct = async () => {
	const yesterdayBeginOfDay = new Date();
	yesterdayBeginOfDay.setDate(new Date().getDate() - 1);
	yesterdayBeginOfDay.setHours(1, 0, 0, 0);

	const dateLimitUntilNextHotSale = new Date();
	dateLimitUntilNextHotSale.setDate(
		dateLimitUntilNextHotSale.getDate() + CONFIG.DAYS_OF_SEARCH_NEXT_HOTSELL
	);

	const hotSellProduct = await prisma.hotSellProduct.findFirst({
		where: {
			maxQuantity: {
				gt: 0,
			},
			startDate: {
				gte: yesterdayBeginOfDay,
			},
			expiredDate: {
				gte: new Date(),
			},
		},
		include: {
			product: true,
		},
	});

	const nextHotSellProduct = await prisma.hotSellProduct.findFirst({
		where: {
			maxQuantity: {
				gt: 0,
			},
			startDate: {
				gte: new Date(),
				lte: dateLimitUntilNextHotSale,
			},
		},
		select: {
			startDate: true,
		},
	});

	if (!hotSellProduct || hotSellProduct.product.quantity < 1) {
		return null;
	}

	const orderQuantity = await getProductSoldQuantity(
		hotSellProduct.addDate,
		hotSellProduct.expiredDate,
		hotSellProduct.productId
	);

	return {
		id: hotSellProduct.productId,
		name: hotSellProduct.product.name,
		imageSrc: hotSellProduct.product.imageSrc,
		price: hotSellProduct.product.price,
		priceDiscount: hotSellProduct.product.discountPrice,
		endDateTime: hotSellProduct.expiredDate,
		orderQuantity,
		maxQuantity: hotSellProduct.maxQuantity,
		nextHotSellProductDate: nextHotSellProduct?.startDate,
	};
};
