const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

type PrismaCategoryNameConstains = {
    name:
    { contains: string }
}

const getCategoriesRelatedToProducts = async () => {
    console.log('getCategoriesRelatedToProducts');
    const categories = await prisma.categories.findMany({
        include: {
            productsCategories: true,
        },
    }) as [];
    return categories;
}

export const getCategoriesByNameRelatedToProducts = async (categoryNames: string[]) => {
    console.log('getCategoriesByNameRelatedToProducts');
    const prismaCategoryNameConstains = new Array<PrismaCategoryNameConstains>;

    //add values search strings to array
    categoryNames.forEach(categoryName => {
        prismaCategoryNameConstains.push({ name: { contains: categoryName } });
    });

    // find all categories of customers search, and this categories are related to products
    const categories = await prisma.categories.findMany({
        where: {
            OR: prismaCategoryNameConstains
        },
        include: {
            productsCategories: true,
        },
    }) as [];

    // not found categories with customerSearch values, get all that have products
    if (!categories?.length) {
        return getCategoriesRelatedToProducts();
    }

    return categories;
}