const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const main = async () => {
    const productCreated = await prisma.Product.create({
        data: {
            name: 'ASUS TUF Gaming F15 i5-11400H/16GB/512/Win11 RTX3050Ti 144Hz',
            imageSrc: 'https://cdn.x-kom.pl/i/setup/images/prod/big/product-new-big,,2022/5/pr_2022_5_24_11_7_54_334_00.jpg',
            vat: 23,
            price: 1926,
            discountPrice: 1720,
            quantity: 5,
            scoreValue: 5,
            installmentPrice: 350,
            hasFreeShipping: true,
            description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repudiandae possimus sapiente, ducimus asperiores error eum ipsam quasi repellendus iste earum laboriosam nesciunt officiis atque rerum quos incidunt aspernatur velit voluptates. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium labore perferendis minus incidunt doloribus, eligendi repudiandae earum dignissimos est neque deserunt consequatur. Repudiandae autem maxime magnam eveniet! Atque, suscipit amet. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Praesentium labore perferendis minus incidunt doloribus, eligendi repudiandae earum dignissimos est neque deserunt consequatur. Repudiandae autem maxime magnam eveniet! Atque, suscipit amet."
        },
    });

    console.log(productCreated);
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