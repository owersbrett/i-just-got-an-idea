import * as functions from "firebase-functions";

import { Entry } from "./types/entry";
import { handleIdeaEntry } from "./entryHandler/handleIdeaEntry";
import { handleKeywordsEntry } from "./entryHandler/handleKeywordsEntry";
import { handleUpdateEntry } from "./entryHandler/handleUpdateEntry";
import { handleDefaultEntry } from "./entryHandler/handleDefaultEntry";
import { handleErrorEntry } from "./entryHandler/handleErrorEntry";

exports.onEntryCreated = functions.firestore.document("entries/{entryId}").onCreate(async (entrySnapshot) => {
  let entry = entrySnapshot.data() as Entry;
  try {
    switch (entry.type) {
      case "idea":
        return handleIdeaEntry(entry);
      case "keywords":
        return handleKeywordsEntry(entry);
      case "update":
        return handleUpdateEntry(entry);
      default:
        return handleDefaultEntry(entry);
    }
  } catch (e) {
    return handleErrorEntry(entry, "Error handling entry");
  }
});
