//@ts-check
import fs from 'fs/promises';
import { ProductManager } from './ProductManager.js';
import path from 'path';

export class CartManager {
    constructor() { }

    async customConstructor() {
        this.path = path.resolve() + "\\src\\daos\\filesystem\\db\\carts.json";
        this.carts = await this.getCarts();
    }

    async getLastId() {
        const carts = await this.getCarts();
        if (carts.length != 0) return carts[carts.length - 1].id;
        else return -1;
    }

    async getCarts() {
        if (this.path == undefined) return null;
        const carts = await fs.readFile(this.path, 'utf8');
        return JSON.parse(carts);
    }

    async addCart() {
        if (this.path == undefined) return null;
        const lastId = await this.getLastId();
        const cart = {
            "id": lastId + 1,
            "products": []
        }
        this.carts.push(cart);
        await fs.writeFile(this.path, JSON.stringify(this.carts));
        return {data: cart};
    }

    async getCartById(id) {
        const foundCart = this.getCart(id);
        if (!!foundCart) return foundCart;
        else {
            console.error(`Cart with id: ${id} not found.`);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        if (this.path == undefined) return null;
        const cartIndex = this.getCartIndex(cartId);
        const productManager = new ProductManager();
        await productManager.customConstructor();
        const product = productManager.getProductById(productId);
        if (cartIndex == null || cartIndex < 0) {
            console.error(`Cart with id: ${cartId} not found.`);
            return -1;
        }
        if (!product) {
            console.error(`Product with id: ${productId} not found.`);
            return -2;
        } else {
            const hasStock = productManager.checkStock(productId);
            if (!hasStock) {
                console.error(`Product with id: ${productId} has no stock.`);
                return -3;
            }
        }
        const productIndex = this.getProductIndex(cartIndex, productId);
        if (productIndex!=null && productIndex>=0) this.carts[cartIndex].products[productIndex].quantity++;
        else this.carts[cartIndex].products.push({ "id": productId, "quantity": 1 })
        await productManager.reduceProductStock(productId);
        await fs.writeFile(this.path, JSON.stringify(this.carts));
        return {data: productManager.getProductById(productId)};
    }

    getCart(id) {
        let foundCart;
        for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].id == id) {
                foundCart = this.carts[i];
                i = this.carts.length;
            }
        }
        return foundCart;
    }

    getCartIndex(id) {
        for (let i = 0; i < this.carts.length; i++) {
            if (this.carts[i].id == id) {
                return i;
            }
        }
        return null;
    }
    getProductIndex(cartIndex, productId) {
        for (let i = 0; i < this.carts[cartIndex].products.length; i++) {
            if (this.carts[cartIndex].products[i].id == productId) {
                return i;
            }
        }
        return null;
    }
    async productsExists(products){
        if (products.length==0) return false;
        const productManager = new ProductManager();
        await productManager.customConstructor();
        let productExist = false;
        let i=0;
        while (!productExist && i < products.length) {
            if (!!productManager.getProductById(products[i].id)) productExist = true;
            else {
                productExist = false;
                i = products.length;
            }
            i++
        }
        return productExist;
    }
}