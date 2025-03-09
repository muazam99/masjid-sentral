import { cache } from "react";
import db from "./index";
import { masjidView } from "./schema";

export const getMasjidView = cache( async (page = 1) => {
    const data = await db.select().from(masjidView).limit(25).offset((page - 1) * 25);
    return data;
});