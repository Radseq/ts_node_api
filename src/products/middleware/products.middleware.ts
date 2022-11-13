import express, { Request, Response, NextFunction } from 'express';

import debug from 'debug';
import { readById } from '../services/products.service';

const log: debug.IDebugger = debug('app:products-controller');

export const validateProductExists = async (req: Request, res: Response, next: NextFunction) => {
    const product = await readById(req.params.productId);
    if (product) {
        next();
    } else {
        res.status(404).send({
            error: `Product ${req.params.productId} not found`,
        });
    }
}

export const extractProductId = async (req: Request, res: Response, next: NextFunction) => {
    req.body.id = req.params.productId;
    next();
}

