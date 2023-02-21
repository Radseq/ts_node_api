import { getOrderProductByDateRange } from "orderProducts/orderProducts";
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

	const quantityArray = ordersProduct.map(
		(ordersProduct) => ordersProduct.quantity
	);

	const sumQuantity = quantityArray.reduce(
		(accumulator, currentValue) => accumulator + currentValue
	);

	return sumQuantity;
};

export const getHotSellProduct = async () => {
	const hotSellExpiriedDate = new Date(new Date().setHours(23, 59, 59));

	const hotSellProduct = await prisma.hotSellProduct.findFirst({
		where: {
			expiredDate: {
				gt: hotSellExpiriedDate,
			},
			maxQuantity: {
				gt: 0,
			},
		},
		include: {
			product: true,
		},
	});

	if (!hotSellProduct || hotSellProduct.product.quantity <= 0) {
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
		endDateTime: hotSellExpiriedDate,
		orderQuantity,
		maxQuantity: hotSellProduct.maxQuantity,
	};
};
