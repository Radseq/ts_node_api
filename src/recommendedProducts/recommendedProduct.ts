import { getCategoriesByNameRelatedToProducts } from "../categories/category"

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const jsonToRecommendedProduct = (
    json: {
        id: number,
        name: string,
        description: string,
        imageSrc: string,
        price: number,
        vat: number,
        promotionPrice: number,
        discountPrice: number,
        hasFreeShipping: boolean,
        isBestseller: boolean
    }
) => {
    return {
        id: json.id,
        name: json.name,
        description: json.description,
        imageSrc: json.imageSrc,
        price: json.price,
        vat: json.price,
        promotionPrice: json.discountPrice,
        category: {
            freeShipping: json.hasFreeShipping ?? false,
            bestseller: json.isBestseller ?? false
        }
    }
}

export const getAllRecommendedProducts = async (customerSearch: { value: string }[]) => {
    const maxResultSize = 12;
    const categories = await getCategoriesByNameRelatedToProducts(customerSearch.map(searchStringValue => searchStringValue.value));

    const categoriesIds = categories.map((category: { id: number, name: string, parentId?: number }) => {
        return category.id;
    })

    const products = await prisma.products.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            imageSrc: true,
            price: true,
            vat: true,
            discountPrice: true,
            hasFreeShipping: true,
            isBestseller: true,
            productsCategories:
            {
                take: 3,
            },
        },
        where: {
            productsCategories:
            {
                some:
                {
                    categoryId: { in: categoriesIds },
                },
            },
        },
        orderBy: {
            scoreValue: 'desc',
        },
        distinct: ['id'],
        take: maxResultSize,
    }) as [];

    return products.map(json => {
        return jsonToRecommendedProduct(json);
    });
}
