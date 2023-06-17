//@ts-check

export class CartsException extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'CartsException';
    }
}