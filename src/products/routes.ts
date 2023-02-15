import express, { Request, Response } from "express";
import { getAllProducts, getProductById, getProductsByName } from "./product";

function createProductRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const products = await getAllProducts()
            resp.status(200).json(products);
        })
        .get('/search/:productName', async (req: Request, resp: Response) => {
            const allProducts = await getProductsByName(req.params.productName);
            resp.status(200).json(allProducts);
        })
        .get('/:productId', async (req: Request, resp: Response) => {
            const product = await getProductById(Number(req.params.productId));
            if (!product) {
                return resp.status(404).send({
                    error: `Product ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(product);
        })
}

export const productRouter = createProductRouter();

