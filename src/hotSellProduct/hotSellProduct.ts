import { prisma } from "../../prisma/prisma";

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

	return {
		id: hotSellProduct.productId,
		name: hotSellProduct.product.name,
		imageSrc: hotSellProduct.product.imageSrc,
		price: hotSellProduct.product.price,
		priceDiscount: hotSellProduct.product.discountPrice,
		endDateTime: hotSellExpiriedDate,
		orderQuantity: 0,
		maxQuantity: hotSellProduct.maxQuantity,
	};
};
