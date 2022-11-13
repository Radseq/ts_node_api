import debug from 'debug';
import express from 'express';
import { getProductById, listProducts } from './controllers/controller';
import { extractProductId, validateProductExists } from './middleware/products.middleware';

const log: debug.IDebugger = debug('app:products-routes');

export const configureProductRoutes = (app: express.Application) => {

    log('Product Routes configured');

    app.route(`/products`)
        .get(listProducts);

    app.param(`productId`, extractProductId);

    app.route(`/products/:productId`)
        .all(validateProductExists)
        .get(getProductById);
}