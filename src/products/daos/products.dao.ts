import { ProductDto } from '../dto/product.dto';
import shortid from 'shortid';
import debug from 'debug';

// note: this file is responsible for connecting to a defined database and performing CRUD operations.
// layer for trasfer data between database and "normal" models

const log: debug.IDebugger = debug('app:in-memory-dao');

const products: Array<ProductDto> = [];

// todo remove after add database
const testInit = () => {
    products.push({
        id: "guid",
        name: "Test",
        imageSrc: "https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png",
        price: 200,
        vat: 23,
        quantity: 234
    });
}

testInit();

export const getProducts = async () => {
    return products;
}

export const getProductById = async (productId: string) => {
    return products.find((product: { id: string }) => product.id === productId);
}
