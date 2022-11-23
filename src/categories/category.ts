const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const categoriesRelatedToProducts = async () => {
    const categories = await prisma.categories.findMany({
        include: {
            productsCategories: true,
        },
    }) as [];
    return categories;
}

export const categoriesByNameRelatedToProducts = async (categoryNames: string[]) => {
    const categoryNameConstains = categoryNames.map(
        categoryName => ({ name: { contains: categoryName } })
    );

    // find all categories of customers search, and this categories are related to products
    const categories = await prisma.categories.findMany({
        where: {
            OR: categoryNameConstains
        },
        include: {
            productsCategories: true,
        },
    }) as [];

    // not found categories with customerSearch values, get all that have products
    if (!categories?.length) {
        return categoriesRelatedToProducts();
    }

    return categories;
}