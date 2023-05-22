import { Entry } from "../types/entry";
import { handleErrorEntry } from "./handleErrorEntry";

export const handleUpdateEntry = async (entry: Entry) => {
    return handleErrorEntry(entry, "Error handling update entry: not implemented yet");
    
  };