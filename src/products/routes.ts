import express, { Request, Response } from "express";
import { z } from "zod";
import { getAllProducts, getProductById } from "./product";

const PRODUCT_ID_VERIFIER = z.coerce.number({
    required_error: "productId is required",
    invalid_type_error: "productId must be a number",
}).min(0);

export function createProductRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const products = await getAllProducts()
            resp.status(200).json(products);
        })
        .get('/:productId', async (req: Request, resp: Response) => {
            const validationResult = PRODUCT_ID_VERIFIER.safeParse(req.params.productId)

            if (!validationResult.success) {
                return resp.status(404).send(validationResult.error);
            }

            const product = await getProductById(validationResult.data);

            if (!product) {
                return resp.status(404).send({
                    error: `Product ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(product);
        })
}

export const productRouter = createProductRouter();

