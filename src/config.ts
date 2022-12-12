
export const CONFIG = {
    MAX_RECOMMENDED_PRODUCTS: Number(process.env.RECOMMENDED_PRODUCTS_MAX_SIZE),
    MAX_PRODUCTS_PER_CATEGORY: Number(process.env.MAX_PRODUCTS_PER_CATEGORY),
    SCORES_MAX_SIZE: Number(process.env.SCORES_MAX_SIZE),
    BASE_PRODUCT_COMMENTS_COUNT: Number(process.env.BASE_PRODUCT_COMMENTS_COUNT)
}