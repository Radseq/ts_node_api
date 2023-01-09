import express, { Response } from "express";
import { getNavigationTree } from "../navigations/navigation";
import { getCacheData, setCacheData } from "../cache";

function createNavigationRouter() {
    return express.Router()
        .get('', async (_, resp: Response) => {
            try {
                let dataResult = await getCacheData('nav');
                if (dataResult) {
                    dataResult = JSON.parse(dataResult);
                } else {
                    dataResult = await getNavigationTree();
                    await setCacheData('nav', JSON.stringify(dataResult));
                }

                resp.send(dataResult);
            } catch (error) {
                console.error(error);
                resp.status(404);
            }
        })
}

export const navigationRouter = createNavigationRouter();

