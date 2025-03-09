export type MosqueView = {
    id: number | null;
    name: string | null;
    imageUrl: string | null;
    countryName: string | null;
    stateName: string | null;
    cityName: string | null;
};

export type Mosque = {
    id: number | null;
    name: string | null;
    thumbnailUrl: string | null;
    description: string | null;
    qrImageUrl: string | null;
    qrContent: string | null;
    googleMapsEmbedded: string | null;
    googleMapsUrl: string | null;
    latitude: string | null;
    longitude: string | null;
    address: string | null;
    countryId: number | null;
    stateId: number | null;
    cityId: number | null;
    tiktokUrl: string | null;
    facebookUrl: string | null;
    whatsappNo: string | null;
    contactNo: string | null;
    faxNo: string | null;
    category: string | null;
    status: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    addedByUserId: number | null;
    state: {
        id: number | null;
        label: string | null;
    } | null;
    city: {
        id: number | null;
        label: string | null;
    } | null;
}