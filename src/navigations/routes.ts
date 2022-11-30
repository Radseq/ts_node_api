import express, { Response } from "express";
import { collectNavigations } from "../navigations/navigation";

function createNavigationRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const navigations = await collectNavigations()
            resp.status(200).json(navigations);
        })
}

export const navigationRouter = createNavigationRouter();

