export interface Activity {
    activityID: number;
    activityName: string;
    destinationID: number;
    Price: number; // Will be string from DB, convert to number
    Description?: string;
    DurationHours?: number;
    // Potentially include destination name via join
    DestinationName?: string;
} 