import express, { Request, Response } from "express";
import { getHotSellProduct } from "./hotSellProduct";
import { getCacheData, setCacheData } from "../cache";

function createHotSellProductRouter() {
	return express.Router().get("", async (_, resp: Response) => {
		let dataResult = await getCacheData("hotsellProduct");
		if (dataResult) {
			dataResult = JSON.parse(dataResult);
		} else {
			dataResult = await getHotSellProduct();
			await setCacheData("hotsellProduct", JSON.stringify(dataResult));
		}

		if (!dataResult) {
			return resp.status(404).send({
				error: `No hotSell product found`,
			});
		}
		return resp.status(200).send(dataResult);
	});
}

export const hotSellProductRouter = createHotSellProductRouter();
