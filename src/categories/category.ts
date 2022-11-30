import { prisma } from "../../prisma/prisma";

export const retrieveAllCategories = async () => {
    const categories = await prisma.category.findMany({
        include: {
            productInCategories: true,
        },
    });

    return categories;
}

export const getNavigationCategories = async (root: boolean = false) => {
    const categories = await prisma.category.findMany({
        where: {
            IsNavigation: true,
        },
    });

    return categories;
}

export const retrieveAllCategoriesByName = async (categoryNames: string[]) => {
    const categoryNameConstains = categoryNames.map(
        categoryName => ({ name: { contains: categoryName } })
    );

    const categories = await prisma.category.findMany({
        where: {
            OR: categoryNameConstains
        },
        include: {
            productInCategories: true,
        },
    });

    return categories;
}