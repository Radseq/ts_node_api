import express from "express";
import {getAllProducts, getProductById} from "./product";

function createProductRouter() {
    return express.Router()
        .get('', async(_, resp) => {
            const products = await getAllProducts()
            resp.status(200).json(products);
        })
        .get('/:productId', async (req, resp) =>{
            const product = await getProductById(Number(req.params.productId));
            if(!product){
                return resp.status(404).send({
                    error: `Product ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(product);
        } )
}

export const productRouter = createProductRouter();

