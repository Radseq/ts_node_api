import { retrieveOneRecommendedProductsOfCategories } from "../recommendedProducts/recommendedProduct";
import { getNavigationCategories } from "../categories/category"
import { Category, Product } from "@prisma/client";

type NavigationProduct = {
    id: number,
    name: string,
    price: number,
    imageSrc: string
}

type Navigation = {
    id: number,
    name: string,
    navigation: Navigation[],
    product?: NavigationProduct
}

export const getNavigationTree = async () => {
    const allCategories = await getNavigationCategories()

    const rootCategories = allCategories.filter(category => !category.parentId)

    const navigations = rootCategories.map(element => {
        return createNavigation(element, allCategories);
    });

    const loadRecommendedProductPerRoot = navigations.map(async rootNavigation => {
        const deepNavigationIds = getNavigationIds(rootNavigation.navigation)
        const rcommendedProduct = await retrieveOneRecommendedProductsOfCategories(deepNavigationIds);

        rootNavigation.navigation.unshift({ id: 0, name: '', navigation: [], product: rcommendedProduct })
        return rootNavigation;
    });

    await Promise.all(loadRecommendedProductPerRoot);

    return navigations;
}

const getNavigationIds = (navigations: Navigation[]): number[] => {
    let navigationIds: number[] = [];
    for (const navigation of navigations) {
        navigationIds.push(navigation.id);
        return navigationIds.concat(getNavigationIds(navigation.navigation));
    }

    return navigationIds;
}

const createNavigation = (category: Category, allCategories: Category[]): Navigation => {
    const childrenCategories = allCategories.filter(childCategory => childCategory.parentId === category.id)
    return {
        id: category.id,
        name: category.name,
        navigation: childrenCategories.map(child => createNavigation(child, allCategories)),
    }
}
