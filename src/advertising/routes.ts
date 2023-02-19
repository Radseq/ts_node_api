import express, { Response } from "express";
import { getAllAdvertisements } from "./advertisement";

const createAdvertisementRouter = () => {
    return express.Router()
        .get('', async (_, resp: Response) => {
            const advertisements = await getAllAdvertisements()
            resp.status(200).json(advertisements);
        })
}

export const advertisementRoute = createAdvertisementRouter();

