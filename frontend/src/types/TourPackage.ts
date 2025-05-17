export interface TourPackage {
    packageID: number;
    PackageName: string;
    BasePrice: number;
    DurationDays: number;
    Description?: string;
    // Add other package details if needed (e.g., season, destination names)
    seasonName?: string;
    destinationName?: string;
} 