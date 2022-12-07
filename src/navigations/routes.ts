import express, { Response } from "express";
import { getNavigationTree } from "../navigations/navigation";

function createNavigationRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const navigations = await getNavigationTree()
            resp.status(200).json(navigations);
        })
}

export const navigationRouter = createNavigationRouter();

