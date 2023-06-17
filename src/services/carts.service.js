//@ts-check
import { CartModel } from '../daos/models/carts.model.js';
import { CartsException } from '../exceptions/carts.exceptions.js';
import { ProductsException } from '../exceptions/products.exceptions.js';
import { ProductService } from './products.service.js'

export class CartService {
    constructor() {
        this.productService = new ProductService();
    }

    async getCarts() {
        const carts = await CartModel.find({}); 
        return carts;
    }

    async addCart() {
        const cart = await CartModel.create({
            "products": []
        })
        if (!!cart) return cart;
        else throw new CartsException(`Something went wrong, cart not created. Please try again.`, 500);
    }

    /**
     * @param {String} id
     */
    async getCartById(id) {
        const foundCart = await CartModel.findById(id).populate({
            path: "products",
            populate: {
                path: "product"
            }
        });
        if (!!foundCart) return foundCart;
        else throw new CartsException(`Cart with id: ${id} not found.`, 404);
    }

    /**
     * @param {String} cartId
     * @param {String} productId
     */
    async addProductToCart(cartId, productId) {
        const hasStock = await this.productService.checkStock(productId)
        if (hasStock) {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new CartsException("Cart not found", 404);
            const productIndex = this.productInCart(cart, productId);
            if (productIndex>=0) cart.products[productIndex].quantity++;
            else cart.products.push({product: productId, quantity: 1});
            await this.productService.reduceProductStock(productId);
            const filter = {_id:cartId}
            await CartModel.updateOne(filter, cart);
            return await this.productService.getProductById(productId);
        } else {
            throw new ProductsException(`Product with id ${productId} doesn't have stock`, 400);
        }
    }
    /**
     * @param {Object} cart
     * @param {String} pid
     */
    productInCart(cart, pid) {
        let productInCart = false;
        let i = 0;
        while (!productInCart && i<cart.products.length) {
            if (pid == cart.products[i].product.toString()) productInCart = true;
            i++;
        }
        i -= 1
        return productInCart ? i : -1;
    }

    /**
     * @param {string} cartId
     * @param {string} productId
     */
    async deleteProduct(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;
        const index = this.productInCart(cart, productId);
        if (!!index) {
            cart.products.splice(index, 1);
        }
        await this.updateCartById(cartId, cart)
    }

    /**
     * @param {string} cartId
     * @param {Object} cart
     */
    async updateCartById(cartId, cart) {
        await CartModel.validate(cart);
        await CartModel.updateOne({_id: cartId}, cart);
    }

    /**
     * @param {string} cartId
     * @param {string} productId
     * @param {Object} cartUpdate
     */
    async updateProductQuantity(cartId, productId, cartUpdate) {
        const cart = await CartModel.findById(cartId);
        if(!cart) return;
        const quantity = cartUpdate.quantity;
        const index = this.productInCart(cart, productId);
        if (!!index && quantity > 0) {
            cart.products[index].quantity = quantity;
        }
        await this.updateCartById(cartId, cart);
    }

    /**
     * @param {string} cartId
     */
    async deleteAllProducts(cartId) {
        const cart = await this.getCartById(cartId);
        if(!!cart) cart.products = [];
    }
}