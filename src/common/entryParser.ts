
import { auth } from "../../firebase/clientApp";
import { Entry } from "./types";

export class EntryParser{
    public static parseEntry(userId: string, ideaId: string, entryValue: string): Entry{  
        let parsedEntry = Entry.new(userId, ideaId, entryValue);
        if (parsedEntry.content.startsWith("+")){
            if (EntryParser.isPhoneNumberValid(parsedEntry.content)){
                parsedEntry.type = "phone";
            }
        }
        return parsedEntry;
    }
    public static  isPhoneNumberValid(phoneNumber: string): boolean {
        // Remove any non-digit characters from the phone number
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
      
        // Define a regular expression pattern for valid phone numbers
        const phonePattern = /^\+?\d{10,14}$/;
      
        // Check if the cleaned phone number matches the pattern
        return phonePattern.test(cleanedPhoneNumber);
      }
}

