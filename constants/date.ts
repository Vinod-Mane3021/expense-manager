
// List of possible date formats
export const possibleDateFormats: string[] = [
    "yyyy-MM-dd",             // ISO format without time (ISO - International Organization for Standardization.)  
    "yyyy-MM-dd HH:mm",       // ISO format without seconds
    "yyyy-MM-dd HH:mm:ss",    // ISO format with time

    "dd-MM-yyyy",             // European format without time
    "dd-MM-yyyy HH:mm",       // European format without seconds
    "dd-MM-yyyy HH:mm:ss",    // European format with time
    
    "MM-dd-yyyy",             // US format without time
    "MM-dd-yyyy HH:mm",       // US format without seconds
    "MM-dd-yyyy HH:mm:ss",    // US format with time
];

export const outputDateFormat = 'yyyy-MM-dd HH:mm:ss';
