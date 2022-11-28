import express, { Request, Response } from "express";
import { getAllRecommendedProducts } from "./recommendedProduct";

function createRecommendedProductRouter() {
    return express.Router()
        .get('', async (req: Request, resp: Response) => {
            const products = await getAllRecommendedProducts(req.body);
            resp.status(200).json(products);
        })
}

export const recommendedProductRouter = createRecommendedProductRouter();
