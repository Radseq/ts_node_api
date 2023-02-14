import { prisma } from "../../prisma/prisma";

export const addNewsletterEmail = async (email: string) => {
    if (await IsEmailExists(email)) return false;

    const add = await prisma.newsletter.create({
        data: {
            email: email,
            addDate: new Date()
        },
    });

    return add.id ?? false;
}

const IsEmailExists = async (email: string) => {
    const alreadyExistsEmail = await prisma.newsletter.findUnique(
        {
            where: {
                email: email
            }
        }
    )
    return alreadyExistsEmail;
}