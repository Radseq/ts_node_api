import express, { Request, Response } from "express";
import { getHotSellProduct } from "./hotSellProduct";

function createHotSellProductRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const product = await getHotSellProduct();
            if (!product) {
                return resp.status(404).send({
                    error: `No hotSell product found`,
                });
            }
            return resp.status(200).json(product);
        })
}

export const hotSellProductRouter = createHotSellProductRouter();

