//@ts-check
import { Schema, model } from "mongoose";

const MESSAGES_TABLE = "messages";

export const MessagesModel = model(MESSAGES_TABLE, new Schema({
    user: { type: String, required: true },
    message: { type: String, required: true},
    date: { type: Date, required: false, default: new Date().toLocaleString()}
    })
);