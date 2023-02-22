import { prisma } from "../../prisma/prisma";

export const getOrderProductsByDate = async (date: Date) => {
	const orderProducts = await prisma.orderProduct.findMany({
		where: {
			addDate: {
				gt: date,
			},
		},
	});

	return orderProducts;
};

export const getOrderProductByDateRange = async (
	dateFrom: Date,
	dateTo: Date,
	productId: number
) => {
	const orderProducts = await prisma.orderProduct.findMany({
		where: {
			addDate: {
				gte: dateFrom,
				lte: dateTo,
			},
			productId: productId,
		},
	});

	return orderProducts;
};
