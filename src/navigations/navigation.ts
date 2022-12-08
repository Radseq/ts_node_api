import { retrieveOneRecommendedProductsOfCategories } from "../recommendedProducts/recommendedProduct";
import { getNavigationCategories } from "../categories/category"
import { Category, Product } from "@prisma/client";

type Navigation = {
    id: number,
    name: string,
    navigation: Navigation[],
    product?: Product
}

export const getNavigationTree = async () => {
    const allCategories = await getNavigationCategories()

    const rootCategories = allCategories.filter(category => !category.parentId)

    const navigations = rootCategories.map(element => {
        return createNavigation(element, allCategories);
    });

    return navigations;
}

const createNavigation = (category: Category, allCategories: Category[]): Navigation => {
    const childrenCategories = allCategories.filter(childCategory => childCategory.parentId === category.id)
    return {
        id: category.id,
        name: category.name,
        navigation: childrenCategories.map(child => createNavigation(child, allCategories)),
    }
}
