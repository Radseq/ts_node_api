import { prisma } from "../../prisma/prisma";

const main = async () => {
    const create = await prisma.category.createMany({
        data: [
            {
                name: 'laptopsAndComputers',
                id: 1,
                parentId: null,
                IsNavigation: true
            },
            {
                name: 'screen',
                id: 2,
                parentId: null,
                IsNavigation: false
            },
            {
                name: 'laptopsNotebooksUltrabooks',
                id: 3,
                parentId: 1,
                IsNavigation: true
            },
            {
                name: 'notebooksLaptops17,3\'\'',
                id: 4,
                parentId: 3,
                IsNavigation: true
            }
        ],
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })