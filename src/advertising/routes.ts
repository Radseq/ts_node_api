import express, { Response } from "express";
import { getAdvertising } from "./advertisement";

const createAdvertisementRouter = () => {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const advertising = await getAdvertising()
            resp.status(200).json(advertising);
        })
}

export const advertisementRoute = createAdvertisementRouter();

