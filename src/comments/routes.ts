import express, { Request, Response } from "express";
import { z } from "zod";
import { getProductComments } from "./comment";

function createCommentRouter() {
    return express.Router()
        .get('/:productId/:pageIndex/:pageSize', async (req: Request, resp: Response) => {
            try {
                const reqParms = z.object({
                    productId: z.number(),
                    pageIndex: z.number(),
                    pageSize: z.number(),
                });

                const validationResult = reqParms.parse({
                    productId: req.params.productId,
                    pageIndex: req.params.pageIndex,
                    pageSize: req.params.pageSize
                });

                const comments = await getProductComments(validationResult.productId, validationResult.pageIndex, validationResult.pageSize);
                if (!comments) {
                    return resp.status(404).send({
                        error: `Comemnts for product id ${req.params.productId} not found`,
                    });
                }
                return resp.status(200).json(comments);
            } catch (error) {
                if (error instanceof z.ZodError) {
                    let Errors: { code: string, message: string }[] = []
                    for (let index = 0; index < error.issues.length; index++) {
                        Errors.push({
                            code: error.issues[index].code,
                            message: error.issues[index].message
                        });
                    }
                    return resp.status(404).send({
                        error: Errors,
                    });
                }
            }
        })
}

export const commentRouter = createCommentRouter();

