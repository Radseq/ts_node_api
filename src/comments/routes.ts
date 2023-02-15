import express, { Request, Response } from "express";
import { z } from "zod";
import { getProductComments } from "./comment";

const POST_DATA_VERIFIER = z.object({
    productId: z.coerce.number({
        invalid_type_error: "productId must be a number",
    }),
    pageIndex: z.coerce.number({
        invalid_type_error: "pageIndex must be a number",
    }),
    pageSize: z.coerce.number({
        invalid_type_error: "pageSize must be a number",
    }),
});

function createCommentRouter() {
    return express.Router()
        .get('/:productId/:pageIndex/:pageSize', async (req: Request, resp: Response) => {
            const validationResult = POST_DATA_VERIFIER.safeParse({
                productId: req.params.productId,
                pageIndex: req.params.pageIndex,
                pageSize: req.params.pageSize
            });

            if (!validationResult.success) {
                return resp.status(404).send(validationResult.error);
            }

            const comments = await getProductComments(validationResult.data.productId,
                validationResult.data.pageIndex, validationResult.data.pageSize);
            if (!comments) {
                return resp.status(404).send({
                    error: `Comemnts for product id ${req.params.productId} not found`,
                });
            }
            return resp.status(200).json(comments);
        })
}

export const commentRouter = createCommentRouter();

