
import { User } from "firebase/auth";
import { auth } from "../../firebase/clientApp";

import { v4 } from "uuid";
import { Entry } from "./types/entry";

export class EntryParser{
    user: User | undefined;
    constructor(user: User | null){
        this.user;
    }




    public static parseEntry(uid: string, ideaId: string, entryValue: string, sessionId: string): Entry{  
        let parsedEntry: Entry = {
            entryId: v4(),
            uid: uid,
            ideaId: ideaId,
            content: entryValue,
            intent: "auth",
            type: "idea",
            createdAt: new Date(),
            updatedAt: new Date(),
            sessionId: sessionId,
            keywords: []
        };
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

