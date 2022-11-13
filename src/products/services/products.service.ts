import { getProductById, getProducts } from '../daos/products.dao';

export const list = async (limit: number, page: number) => {
    return getProducts();
}

export const readById = async (id: string) => {
    return getProductById(id);
}
