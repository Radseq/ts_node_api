import { getOrderProductByDateRange } from "../orderProducts/orderProducts";
import { prisma } from "../../prisma/prisma";

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
	const todayTimeValue = new Date();
	const today = new Date(todayTimeValue);

	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	// get hotsell product which started today after 10 am, and expired tomorrow at 10 am
	// or get hotsell product which started yesterday at 10 am, and expired today to 10 am

	const hotSellProduct = await prisma.hotSellProduct.findFirst({
		where: {
			OR: [
				{
					startDate: {
						lte: today,
					},
					maxQuantity: {
						gt: 0,
					},
					expiredDate: {
						gte: tomorrow,
					},
				},
				{
					startDate: {
						lte: yesterday,
					},
					maxQuantity: {
						gt: 0,
					},
					expiredDate: {
						gte: today,
					},
				},
			],
		},
		include: {
			product: true,
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
	};
};
