export interface Hotel {
    hotelID: number;
    hotelName: string;
    PhoneNumber?: string;
    Location: string;
    destinationID: number;
    Description?: string;
    StarRating?: number;
    // Potentially include destination name via join
    DestinationName?: string;
} 