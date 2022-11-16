type Product = {
    id: string;
    name: string;
    imageSrc: string;
    price: number;
    vat: number;
    quantity: number;
    discountPrice?: number;
    description?: string;
}

const products = [] as Product[];
if(process.env.ENVIRONMENT !== 'production'){
    products.push({
        id: "guid",
        name: "Test",
        imageSrc: "https://uxwing.com/wp-content/themes/uxwing/download/hand-gestures/good-icon.png",
        price: 200,
        vat: 23,
        quantity: 234
    });
}
export const getAllProducts = () => Promise.resolve(products);

export const getProductById = (id: Product['id'] ) => {
    const productById = products.find(product => product.id === id)
    return Promise.resolve(productById)
}
