export interface Booking {
    bookingID: number;
    userID: number;
    packageID: number | null;
    BookingDate: string; // Assuming date string from backend
    BookingPrice: number; // Will be string from DB, convert to number
    BookingStatus: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    // Add related info that might be joined from other tables (e.g., PackageName, UserName)
    PackageName?: string;
    FirstName?: string; // User's first name
    LastName?: string; // User's last name
} 