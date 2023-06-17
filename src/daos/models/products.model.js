//@ts-check
import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const PRODUCT_COLLECTION = "products";

const schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: false, default: true },
    thumbnails: { type: Array, required: false, default: [] },
});

schema.plugin(mongoosePaginate);

export const ProductModel = model(PRODUCT_COLLECTION, schema);