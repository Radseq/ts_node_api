import express from "express";
import cors from "cors";
import { productRouter } from "./products";
import { recommendedProductRouter } from "./recommendedProducts/routes";
import { navigationRouter } from "./navigations/routes";
import { commentRouter } from "./comments/routes";
import { newsletterRouter } from "./newsletter/routes";
import { advertisementRoute } from "./advertising/routes";
import { hotSellProductRouter } from "hotSellProduct/routes";

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use("/product/", productRouter);
app.use("/recommendedProduct", recommendedProductRouter);
app.use("/navigation", navigationRouter);
app.use("/comment", commentRouter);
app.use("/newsletter/", newsletterRouter);
app.use("/advertisement", advertisementRoute);
app.use("/hotSellProduct", hotSellProductRouter);

app.listen(port, () => {
	const runningMessage = `Server running at http://localhost:${port}`;
	console.log(runningMessage);
});
