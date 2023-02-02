import express, { Request, Response } from "express";
import { z } from "zod";
import { getAllProducts, getProductById } from "./product";

export function createProductRouter() {
    return express.Router()
        .get('', async (_, resp) => {
            const products = await getAllProducts()
            resp.status(200).json(products);
        })
        .get('/:productId', async (req: Request, resp: Response) => {
            try {
                const productId = z.coerce.number({
                    required_error: "productId is required",
                    invalid_type_error: "productId must be a number",
                }).min(0).parse(req.params.productId);

                const product = await getProductById(productId);

                if (!product) {
                    return resp.status(404).send({
                        error: `Product ${req.params.productId} not found`,
                    });
                }
                return resp.status(200).json(product);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    let Errors: { code: string, message: string }[] = []
                    for (let index = 0; index < error.issues.length; index++) {
                        Errors.push({
                            code: error.issues[index].code,
                            message: req.params.productId + ": " + error.issues[index].message
                        });
                    }
                    return resp.status(404).send({
                        error: Errors,
                    });
                }
            }
        })
}

export const productRouter = createProductRouter();

