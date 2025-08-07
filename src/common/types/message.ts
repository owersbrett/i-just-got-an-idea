export interface Message {
    id: string;
    uid: string; // user id
    title: string;
    description: string;
    timestamp: Date;
    processed: boolean;
}

export class Message {
    constructor(
        public id: string,
        public uid: string,
        public title: string,
        public description: string,
        public timestamp: Date = new Date(),
        public processed: boolean = false
    ) {}

    public static new(uid: string, title: string, description: string): Message {
        const id = `${uid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return new Message(id, uid, title, description);
    }
}
