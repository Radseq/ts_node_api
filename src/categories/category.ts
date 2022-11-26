const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const retrieveAllCategories = async () => {
    const categories = await prisma.categories.findMany({
        include: {
            productInCategories: true,
        },
    }) as [];
    return categories;
}

export const retrieveAllCategoriesByName = async (categoryNames: string[]) => {
    const categoryNameConstains = categoryNames.map(
        categoryName => ({ name: { contains: categoryName } })
    );

    const categories = await prisma.categories.findMany({
        where: {
            OR: categoryNameConstains
        },
        include: {
            productInCategories: true,
        },
    }) as [];

    if (!categories?.length) {
        return retrieveAllCategories();
    }

    return categories;
}