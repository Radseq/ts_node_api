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
        .get('/commentPage', async (req: Request, resp: Response) => {
            const result = POST_DATA_VERIFIER.safeParse(req.body)

            if (!result.success) {
                return resp.status(404).send(result.error);
            }

            const { productId, pageSize, pageIndex } = result.data;

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

