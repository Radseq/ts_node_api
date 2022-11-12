import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';

export class ProductsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ProductsRoutes');
    }

    configureRoutes() {

        this.app.route(`/products`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`List of products`);
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send(`Post to products`);
            });

        this.app.route(`/products/:productId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request to /products/:productId
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET requested for id ${req.params.productId}`);
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`PUT requested for id ${req.params.productId}`);
            })
            .patch((req: express.Request, res: express.Response) => {
                res.status(200).send(`PATCH requested for id ${req.params.productId}`);
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested for id ${req.params.productId}`);
            });

        return this.app;
    }

}