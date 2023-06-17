//@ts-check
import { Router } from "express";
import { MessageService } from "../services/messages.service.js";
export const routerMessages = Router();

const messagesService = new MessageService();

routerMessages.get("/", async (req, res) => {
    try {
        const messages = await messagesService.getAllMessages();
        return res.status(200).render("chat",{ messages });
    } catch (err) {
        console.log(err);
    };
});