import { prisma } from "../../prisma/prisma";

const main = async () => {
    const categories = await prisma.category.createMany({
        data: [
            {
                name: 'laptopsAndComputers',
                id: 1,
                parentId: null,
            },
            {
                name: 'screen',
                id: 2,
                parentId: null,
            },
            {
                name: 'laptopsNotebooksUltrabooks',
                id: 3,
                parentId: 1,
            },
            {
                name: 'notebooksLaptops17,3\'\'',
                id: 4,
                parentId: 3,
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