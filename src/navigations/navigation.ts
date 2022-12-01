import { retrieveOneRecommendedProductsOfCategories } from "../recommendedProducts/recommendedProduct";
import { getNavigationCategories } from "../categories/category"

type Navigation = {
    id: number,
    name: string,
    childIds: number[],
    isRoot?: boolean,
    recommendedProduct?: any,
}

const returnRecursiveIdsArray = (navigations: Navigation[], id: number): number[] => {
    const nav = navigations.find(a => a.id == id);
    let resultIdArray: number[] = [id];
    if (nav?.childIds) {
        return resultIdArray.concat(nav.childIds.map(id => returnRecursiveIdsArray(navigations, id)).flat());
    }
    return resultIdArray;
}

const idsPerNavigationTree = (navigations: Navigation[]) => {
    let rootTreeMatrix: number[][] = [];
    navigations.forEach(element => {
        if (element.isRoot) {
            let resultIdArray: number[] = [element.id];
            if (element.childIds) {
                resultIdArray = resultIdArray.concat(element.childIds.map(id => returnRecursiveIdsArray(navigations, id)).flat());
            }
            rootTreeMatrix.push(resultIdArray);
        }
    });

    return rootTreeMatrix;
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

    // todo get recommended product idsPerNavigationTree

    return navigations;
}
