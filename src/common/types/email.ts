export interface Email {
    id: string;
    uid: string; // user id
    email: string;
    timestamp: Date;
    processed: boolean;
}

export class Email {
    constructor(
        public id: string,
        public uid: string,
        public email: string,
        public timestamp: Date = new Date(),
        public processed: boolean = false
    ) {}

    public static new(uid: string, email: string): Email {
        const id = `${uid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return new Email(id, uid, email);
    }
}
