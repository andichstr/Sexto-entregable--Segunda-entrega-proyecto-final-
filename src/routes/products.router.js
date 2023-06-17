//@ts-check
import { Router } from "express";
import { ProductService } from "../services/products.service.js";

const router = Router();
const service = new ProductService();

router.get("/", async (req, res) => {
    const { limit, page, query, sort } = req.query;
    const options = {
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: sort? String(sort) : undefined,
    }
    let products = await service.getProducts(query||"{}", options);
    return res.status(200).json(products);
});

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const response = await service.getProductById(id);
        if (!!response) return res.status(200).json({
            status: "Success",
            message: "Product found",
            data: response
        })
        else return res.status(404).json({
            status: "Error",
            message: `Product with id=${id} not found`,
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: `${e.name}: ${e.message}`,
            data: null
        });
    }
});

router.post("/", async (req, res) => {
    try{
        if(Object.keys(req.body).length !== 0) {
            const product = req.body;
            const response = await service.addProduct(product);
            return res.status(201).json({
                status: "Success",
                message: `Product created successfully with id=${response._id}`,
                data: response
            });
        } else return res.status(404).json({
            status: "Error",
            message: "No product found to add on body request.",
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message,
            data: null
        })
    };
});

router.put("/:pid", async (req, res) => {
    try {
        if (!!req.body){
            const id = req.params.pid;
            const update = req.body;
            const response = await service.updateProduct(id, update);
                return res.status(200).json({
                    status: "Success",
                    message: "Products found",
                    data: response
                });
        } else return res.status(400).json({
            status: "Error",
            message: "No product found to add on body request.",
            data: null
        });
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message,
            data: null
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const resp = await service.deleteProduct(id);
        if (resp.deletedCount!=0){
            return res.status(200).json({
                status: "Success",
                message: `Product with id=${id} was successfully deleted`
            })
        } else {
            return res.status(404).json({
                status: "Not Found",
                message: `Product with id=${id} was not found in the database`
            })
        }
    } catch (e) {
        return res.status(e.status).json({
            status: "Error",
            message: e.message
        });
    }
});

export default router;