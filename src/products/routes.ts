import express, { Request, Response } from "express";
import { z } from "zod";
import { getAllProducts, getProductById } from "./product";

export function createProductRouter() {
	return express
		.Router()
		.get("", async (_, resp: Response) => {
			const products = await getAllProducts();
			resp.status(200).json(products);
		})
		.get("/:productId", async (req: Request, resp: Response) => {
			const result = z.coerce
				.number()
				.min(0)
				.safeParse(req.params.productId);

			if (!result.success) {
				return resp.status(404).send(result.error);
			}

			const product = await getProductById(result.data);

			if (!product) {
				return resp.status(404).send({
					error: `Product ${req.params.productId} not found`,
				});
			}
			return resp.status(200).json(product);
		});
}

export const productRouter = createProductRouter();
