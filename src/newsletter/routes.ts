import express, { Response, Request } from "express";
import { z } from "zod";
import { addNewsletterEmail } from "./newsletter";

function createNewsletterRouter() {
    return express.Router()
        .post('', async (req: Request, resp: Response) => {
            try {
                z.coerce.string()
                    .email({ message: "Invalid email address" })
                    .min(10)
                    .parse(req.body.email);

                const added = await addNewsletterEmail(req.body.email)
                if (added) {
                    resp.status(200).send();
                } else {
                    resp.status(500).send();
                }
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

export const newsletterRouter = createNewsletterRouter();

