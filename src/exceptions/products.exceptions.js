//@ts-check

export class ProductsException extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ProductsException';
    }
}