import express, { Request, Response } from "express";
import { getProductComments } from "./comment";

function createCommentRouter() {
    return express.Router()
        .get('/:productId/:pageIndex/:pageSize', async (req: Request, resp: Response) => {
            const productId = Number(req.params.productId);
            const pageIndex = Number(req.params.pageIndex);
            const pageSize = Number(req.params.pageSize);
            const comments = await getProductComments(productId, pageIndex, pageSize);
            if (!comments) {
                return resp.status(404).send({
                    error: `Comemnts for product id ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(comments);
        })
}

export const commentRouter = createCommentRouter();

