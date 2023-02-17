import express, { Request, Response } from "express";
import { getAllProducts, getProductById } from "./product";

export function createProductRouter() {
	return express
		.Router()
		.get("", async (_, resp: Response) => {
			const products = await getAllProducts();
			resp.status(200).json(products);
		})
		.get("/:productId", async (req: Request, resp: Response) => {
			const productID = parseInt(req.params.productId);

			if (isNaN(productID)) {
				return resp
					.status(404)
					.send("parm product id, required number got nan/string");
			}

			const product = await getProductById(productID);

			if (!product) {
				return resp.status(404).send({
					error: `Product with id: ${req.params.productId} not found`,
				});
			}
			return resp.status(200).json(product);
		});
}

export const productRouter = createProductRouter();
