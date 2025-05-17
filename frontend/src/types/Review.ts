export interface Review {
    reviewID: number;
    userID: number;
    packageID: number | null;
    hotelID: number | null;
    activityID: number | null;
    bookingID: number | null;
    reviewDate: string; // Assuming date string from backend
    rating: number; // int 1-5
    comment?: string; // varchar(500)
    // Potentially include user and package/hotel/activity names via joins in backend
    FirstName?: string; // User's first name
    LastName?: string; // User's last name
    PackageName?: string;
    HotelName?: string;
    ActivityName?: string;
} 