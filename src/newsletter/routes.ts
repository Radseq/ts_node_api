import express, { Response, Request } from "express";
import { z } from "zod";
import { addNewsletterEmail } from "./newsletter";

const EMAIL_VERIFIER = z.coerce.string()
    .email({ message: "Invalid email address" }).min(10);

function createNewsletterRouter() {
    return express.Router()
        .post('', async (req: Request, resp: Response) => {
            const result = EMAIL_VERIFIER.safeParse(req.body.email)

            if (!result.success) {
                return resp.status(400).send("Invalid email address")
            }

            const added = await addNewsletterEmail(req.body.email)
            if (added) {
                resp.status(200).send();
            } else {
                resp.status(500).send();
            }
        })
}

export const newsletterRouter = createNewsletterRouter();

