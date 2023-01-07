import express, { Response } from "express";
import { getNavigationTree } from "../navigations/navigation";
import { cache } from "../cache";

function createNavigationRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            try {
                const result = await cache.get('nav');
                let dataResult;
                if (result) {
                    dataResult = JSON.parse(result);
                } else {
                    const navigations = await getNavigationTree();
                    dataResult = navigations;
                    await cache.set('nav', JSON.stringify(dataResult));
                    cache.expire('nav', 10) // ttl 10 seconds
                }

                resp.send(dataResult);
            } catch (error) {
                console.error(error);
                resp.status(404);
            }
        })
}

export const navigationRouter = createNavigationRouter();

