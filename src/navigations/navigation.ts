import { retrieveOneRecommendedProductsOfCategories } from "../recommendedProducts/recommendedProduct";
import { getNavigationCategories } from "../categories/category"
import { Product } from "@prisma/client";

type Navigation = {
    id: number,
    name: string,
    navigation: Navigation[],
    product?: Product
}

const findParentNavigation = (navigations: Navigation[], parentId: number): Navigation | undefined => {
    for (let index = 0; index < navigations.length; index++) {
        const nav = navigations[index];
        if (nav.id === parentId) {
            return nav;
        }
        else if (nav.navigation) {
            const parent = findParentNavigation(nav.navigation, parentId);
            if (parent)
                return parent;
        }
    }

    return undefined;
}

export const collectNavigations = async () => {
    const categories = await getNavigationCategories();

    let navigations: Navigation[] = [];

    categories.forEach(({ id, name, parentId }) => {
        if (parentId) {
            const foundNavigation = findParentNavigation(navigations, parentId);
            if (foundNavigation) {
                foundNavigation.navigation.push({ id, name, navigation: [] });
            }
        } else {
            navigations.push({ id, name, navigation: [] })
        }
    });

    return navigations;
}
