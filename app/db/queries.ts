import { cache } from "react";
import db from "./index";
import { districts, masjid } from "./schema";
import { and, eq } from "drizzle-orm";


export const getMasjidById = cache( async (id: number) => {

    const data = await db.select({
        id: masjid.id,
        name: masjid.name,
        thumbnailUrl: masjid.thumbnailUrl,
        description: masjid.description,
        qrImageUrl: masjid.qrImageUrl,
        qrContent: masjid.qrContent,
        googleMapsEmbedded: masjid.googleMapsEmbedded,
        googleMapsUrl: masjid.googleMapsUrl,
        latitude: masjid.latitude,
        longitude: masjid.longitude,
        address: masjid.address,
        countryId: masjid.countryId,
        stateId: masjid.stateId,
        cityId: masjid.cityId,
        tiktokUrl: masjid.tiktokUrl,
        facebookUrl: masjid.facebookUrl,
        whatsappNo: masjid.whatsappNo,
        contactNo: masjid.contactNo,
        faxNo: masjid.faxNo,
        category: masjid.category,
        status: masjid.status,
        createdAt: masjid.createdAt,
        updatedAt: masjid.updatedAt,
        addedByUserId: masjid.addedByUserId
    })
    .from(masjid)
    .where(
        and(
            eq(masjid.id, id),
            eq(masjid.status, 'active')
        )
    );
    
    const state = await getStateById(data[0].stateId ?? 0);
    const city = await getCityById(data[0].cityId ?? 0);

    return {
        ...data[0],
        state: state,
        city: city
    };
})

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

export const getStateById = cache( async (id: number) => {
    const data = await db.select({
        id: districts.id,
        label: districts.label
    })
        .from(districts)
        .where(and(
            eq(districts.id, id),
            eq(districts.group, 'STATE'),
            eq(districts.key, 'state_name'),
            eq(districts.status, 'active')
        ));
    
    if( data.length === 0 ) {
        return null;
    }
    return data[0];
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
  
    return data[0];
});

export const getCityById = cache( async (id: number) => {
    const data = await db.select({
        id: districts.id,
        label: districts.label
    })
        .from(districts)
        .where(and(
            eq(districts.id, id),
            eq(districts.group, 'CITY'),
            eq(districts.key, 'city_name'),
            eq(districts.status, 'active')
        ));
    if( data.length === 0 ) {
        return null;
    }

    return data[0];
});