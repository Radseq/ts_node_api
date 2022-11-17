import express, { Request, Response } from "express";
import { getAllRecommendedProducts, getRecommendedProductById } from "./recommendedProduct";

function createRecommendedProductRouter() {
    return express.Router()
        .get('', async (_, resp) => {
            const products = await getAllRecommendedProducts();
            resp.status(200).json(products);
        })
        .get('/:productId', async (req: Request, resp: Response) => {
            const product = await getRecommendedProductById(Number(req.params.productId));
            if (!product) {
                return resp.status(404).send({
                    error: `Recommended product ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(product);
        })
}

export const recommendedProductRouter = createRecommendedProductRouter();
