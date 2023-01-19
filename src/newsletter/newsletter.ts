import { prisma } from "../../prisma/prisma";

export const addNewsletterEmail = async (email: string) => {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!email.match(mailformat)) return false;

    const alreadyExistsEmail = await prisma.newsletter.findUnique(
        {
            where: {
                email: email
            }
        }
    )

    if (alreadyExistsEmail) return false;

    const add = await prisma.newsletter.create({
        data: {
            email: email,
            addDate: new Date()
        },
    });

    if (add.id > 0) return true;

    return false;
}