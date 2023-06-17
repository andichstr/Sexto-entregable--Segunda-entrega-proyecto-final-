//@ts-check

export class MessagesException extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'MessagesException';
    }
}