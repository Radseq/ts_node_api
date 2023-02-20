import express, { Request, Response } from "express";
import {
	getAllBestsellerProducts,
	getAllProducts,
	getProductById,
	getProductsByName,
} from "./product";

function createProductRouter() {
	return express
		.Router()
		.get("", async (_, resp: Response) => {
			const products = await getAllProducts();
			resp.status(200).json(products);
		})
		.get("/bestsellers", async (_, resp: Response) => {
			const bestsellerProducts = await getAllBestsellerProducts();
			resp.status(200).json(bestsellerProducts);
		})
		.get("/search/:productName", async (req: Request, resp: Response) => {
			const allProducts = await getProductsByName(req.params.productName);
			resp.status(200).json(allProducts);
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
