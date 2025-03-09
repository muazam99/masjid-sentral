import { cache } from "react";
import db from "./index";
import { districts, masjidView } from "./schema";
import { and, eq } from "drizzle-orm";

export const getMasjidView = cache( async (page = 1) => {
    const data = await db.select().from(masjidView).limit(25).offset((page - 1) * 25);
    return data;
});

export const getStates = cache( async () => {
    const data = await db.select()
        .from(districts)
        .where(and(
            eq(districts.parentId, 1),
            eq(districts.group, 'STATE'),
            eq(districts.key, 'state_name'),
            eq(districts.status, 'active')
        ));
    return data;
});

export const getCities = cache( async (stateId: number) => {
    const data = await db.select()
        .from(districts)
        .where(and(
            eq(districts.parentId, stateId),
            eq(districts.group, 'CITY'),
            eq(districts.key, 'city_name'),
            eq(districts.status, 'active')
        ));
    return data;
});