import { CONFIG } from "../config";
import { prisma } from "../../prisma/prisma";

export const getAdvertising = async () => {

    const fromMonthsPriorToToday = new Date();
    fromMonthsPriorToToday.setMonth(fromMonthsPriorToToday.getMonth() - CONFIG.ADV_FROM_MONTHS_PRIOR_TO_TODAY);
    console.log('now', new Date())
    const allAdvertising = await prisma.advertisement.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            imageSrc: true
        },
        where: {
            addDate: {
                gt: fromMonthsPriorToToday
            },
            expiredDate: {
                gt: new Date()
            }
        }
    });

    return allAdvertising;
}