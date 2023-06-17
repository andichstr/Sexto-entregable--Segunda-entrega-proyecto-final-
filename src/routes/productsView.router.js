//@ts-check
import { Router } from "express";
import { ProductService } from "../services/products.service.js";

const router = Router();
const service = new ProductService();

router.get("/", async (req, res) => {
    const { limit, page, query, sort } = req.query;
    const options = {
        page: Number(page) || 1,
        limit: Number(limit) || 12,
        sort: sort ? String(sort) : undefined,
    }
    let response = await service.getProducts(query||"{}", options);
    if (response.status == "Success") {
        const products = [];
        for (let i = 0; i < response.payload.length; i++) {
            products.push({
                id: response.payload[i]._id.toString(),
                title: response.payload[i].title,
                description: response.payload[i].description,
                code: response.payload[i].code,
                price: response.payload[i].price,
                stock: response.payload[i].stock,
                category: response.payload[i].category,
                status: response.payload[i].status,
                thumbnails: response.payload[i].thumbnails
            })
        }
        delete response.payload;
        return res.status(200).render("products", { data: {
            products: products,
            info: response
        }});
    } else res.status(404).json({
        status: response.status,
        message: "Product not found in this page."
    })
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    let response = await service.getProductById(pid);
    const product = {
        id: response._id.toString(),
        title: response.title,
        description: response.description,
        code: response.code,
        price: response.price,
        status: response.status,
        stock: response.stock,
        category: response.category,
        thumbnails: response.thumbnails
    }
    return res.status(200).render("singleProduct", {
        product: product
    });
});

export default router;