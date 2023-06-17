//@ts-check
import { Schema, model } from "mongoose";

const CART_TABLE = "carts";

export const CartModel = model(CART_TABLE, new Schema({
    products: {
        type: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number
                }
            }
        ] 
    },
}));
