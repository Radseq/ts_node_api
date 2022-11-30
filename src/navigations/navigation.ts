import { getNavigationCategories } from "../categories/category"

type NavigationRecommendedProduct = {
    id: number
    name: string
    price: number
    imgUrl: string
    descFirst: string
    descSecond: string
    descThird: string
}

type Navigation = {
    id: number,
    name: string,
    childIds: number[],
    isRoot?: boolean,
    recommendedProduct?: NavigationRecommendedProduct,
}

export const collectNavigations = async () => {
    const categories = await getNavigationCategories();

    let navigations: Navigation[] = [];

    categories.forEach(({ id, name, parentId }) => {
        if (parentId) {
            const foundNavigation = navigations.find(element => element.id == parentId);
            if (foundNavigation) {
                foundNavigation.childIds.push(id);
            }
        }
        navigations.push({ id, name, childIds: [], isRoot: parentId ? undefined : true })
    });

    // todo get caterogies ids, down of root,
    // todo get recommended product using caterogies ids

    return navigations;
}
