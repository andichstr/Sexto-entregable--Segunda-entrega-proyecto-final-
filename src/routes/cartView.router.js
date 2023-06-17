//@ts-check
import { Router } from "express";
import { CartService } from "../services/carts.service.js";

const router = Router();
const service = new CartService();

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const response = await service.getCartById(cid);
    const products = [];
    response?.products.forEach(element => {
        console.log(element);
        products.push({
            product: {
                id: element.product?._id.toString(),
                title: element.product?.title,
                description: element.product?.description,
                code: element.product?.code,
                price: element.product?.price,
                stock: element.product?.stock,
                category: element.product?.category,
                status: element.product?.status,
                thumbnails: element.product?.thumbnails,
            },
            quantity: element.quantity
        })
    });
    const cart = {
        id: response?._id.toString(),
        products: products,
    }
    console.log(cart);
    return res.status(200).render("cart", {
        cart: cart
    });
});

export default router;