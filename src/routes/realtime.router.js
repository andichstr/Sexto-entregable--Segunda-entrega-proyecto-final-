import { Router } from "express";
import { ProductService } from "../services/products.service.js";

const router = Router();
const service = new ProductService();

router.get('/', async (req, res) => {
    const { limit, page, query, sort } = req.query;
    const options = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: sort? String(sort) : undefined,
    }
    const response = await service.getProducts(query||"{}", options);
    if (!!response){
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
        return res.status(200).render("realTimeProducts",{ products: products });
    }
    else return res.status(404).json({
            status: "Error",
            message: "Products not found",
            data: null
    })
    
})

export default router;