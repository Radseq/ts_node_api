import express, { Response, Request } from "express";
import { addNewsletterEmail } from "./newsletter";

function createNewsletterRouter() {
    return express.Router()
        .post('', async (req: Request, resp: Response) => {
            const added = await addNewsletterEmail(req.body.email)
            if (added) {
                resp.status(200).send();
            } else {
                resp.status(500).send();
            }
        })
}

export const newsletterRouter = createNewsletterRouter();

