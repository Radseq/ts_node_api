
import { Response, Request } from 'express';

import debug from 'debug';
import { list, readById } from '../services/products.service';

const log: debug.IDebugger = debug('app:products-controller');

export const listProducts = async (req: Request, res: Response) => {
    const products = await list(100, 0);
    res.status(200).send(products);
}

export const getProductById = async (req: Request, res: Response) => {
    const product = await readById(req.body.id);
    res.status(200).send(product);
}
