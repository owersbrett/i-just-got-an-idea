import { v4 } from "uuid";

export class Session {
    sessionId!: string;
    uid!: string | null;
    startTime!: Date;
    endTime!: Date | null;

    constructor(uid: string | null) {
        this.sessionId = v4();
        this.uid = uid;
        this.startTime = new Date();
        this.endTime = null;
    }

  }