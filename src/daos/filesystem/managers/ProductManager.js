//@ts-check
import fs from 'fs/promises';
import path from 'path';

export class ProductManager {
    constructor () {}

    async customConstructor(){
        this.path = path.resolve() + "\\src\\daos\\filesystem\\db\\products.json";
        this.products = await this.getProducts();
    }

    async getLastId() {
        const products = await this.getProducts();
        if(products.length!=0) return products[products.length-1].id;
        else return -1;
    }

    async addProduct(product) {
        if (this.path == undefined) return null;
        if (this.isValidProduct(product)) {
            const products = await this.getProducts();
            if (!this.isCodeRepeated(products, product.code)){
                const id = await this.getLastId() + 1;
                const newProduct = {
                    "id": id,
                    "title": product.title,
                    "description": product.description,
                    "code": product.code,
                    "price": product.price,
                    "stock": product.stock,
                    "category": product.category,
                    "status": true,
                    "thumbnails": []
                }
                products.push(newProduct);
                this.products = products;
                await fs.writeFile(this.path, JSON.stringify(this.products), "utf-8");
                return {data: newProduct};
            } else {
                console.error(`Error al agregar producto ingresado con codigo ${product.code}: Codigo repetido.`)
                return {error: -1};
            }
            
        } else {
            const errorMsg = this.errorForProps(product);
            console.log(errorMsg);
            return {
                error: -2,
                message: errorMsg
            };
        }
    }

    async getProducts() {
        if (this.path == undefined) return null;
        try {
            const response = await fs.readFile(this.path, "utf-8");
            if (response) {
                return JSON.parse(response);
            } else {
                return [];
            }
        } catch (error) {
            console.error(`Error al leer el archivo de productos: ${error.message}`);
            return [];
        }
    }

    getProductById(id) {
        let foundProduct;
        for (let i = 0; i<this.products.length; i++) {
            if (this.products[i].id == id){
                foundProduct = this.products[i];
                i = this.products.length;
            }
        }
        if(!!foundProduct) return {data: foundProduct};
        else {
            console.error(`Product with id: ${id} not found.`);
            return null;
        }
    }

    async updateProduct(id, product) {
        if (this.path == undefined) return null;
        if (!!product.id) return -4;
        if (!this.validateProductProperties(product)) return -5;
        const products = await this.getProducts();
        if (this.hasValidProp(product)) {
            if (this.isCodeRepeated(products, product.code)){
                console.log(`El codigo del producto ${JSON.stringify(product)} esta repetido`);
                return -3;
            }
            let found = false;
            let i = 0;
            let newProduct;
            while (i < products.length && !found) {
                if (products[i].id == id) {
                    found = true;
                    const title = product.title ? product.title : products[i].title;
                    const description = product.description? product.description : products[i].description;
                    const code = product.code? product.code : products[i].code;
                    const price = product.price? product.price : products[i].price;
                    const stock = product.stock>=0? product.stock : products[i].stock;
                    const category = product.category? product.category : products[i].category;
                    const status = product.status? product.status : products[i].status;
                    const thumbnails = product.thumbnails? product.thumbnails : products[i].thumbnails;
                    const newProduct = {
                        "id": id,
                        "title": title,
                        "description": description,
                        "code": code,
                        "price": price,
                        "stock": stock,
                        "category": category,
                        "status": status,
                        "thumbnails": thumbnails
                    }
                    products[i] = newProduct;
                }
                i++;
            }
            if (found) {
                this.products = products;
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return {data: newProduct};
            } else {
                console.log(`Product with id: ${id} not found.`);
                return -2;
            }
        } else {
            console.log(`El producto ${JSON.stringify(product)} no contiene ninguna propiedad valida para actualizar`);
            return -1;
        };
    }

    async deleteProduct(id) {
        if (this.path == undefined) return null;
        const products = await this.getProducts();
        let found = false;
        let i = 0;
        let product;
        while (i < products.length && !found) {
            if (products[i].id == id) {
                product = products[i];
                products.splice(i, 1);
                found = true;
            }
            i++;
        }
        if (found) {
            this.products = products;
            await fs.writeFile(this.path, JSON.stringify(this.products));
            return {data: product};
        } else {
            console.log(`Product with id: ${id} not found.`);
            return null;
        }
    }
    isValidProduct(product) {
        if (!product.title || !product.description || !product.code || !product.price || product.stock<0 || !product.category) {
            return false;
        }
        return true;
    }
    hasValidProp(product) {
        return (!!product.title || !!product.description || !!product.code || !!product.price || !!product.stock || !!product.category);
    }
    checkStock(id) {
        const product = this.getProductById(id);
        return (!!product && product.stock>0);
    }
    async reduceStock(products){
        let i = 0;
        let hasStock = true;
        let product;
        while(hasStock && i < products.length) {
            product = this.getProductById(products[i].id);
            if (!!product && product.stock < products[i].quantity) hasStock = false;
            i++;
        }
        if (hasStock){
            for (let n = 0; n < products.length; n++){
                product = this.getProductById(products[n].id);
                if (!!product) { 
                    product.stock -= products[n].quantity
                    await this.updateProduct(products[n].id, product);
                }
            }
            return true;
        }
        return false;
    }
    async reduceProductStock(id){
        const product = this.getProductById(id);
        if (!product) return;
        product.stock--;
        await this.updateProduct(id, product);
    }
    isCodeRepeated(products, code) {
        let isCodeRepeated = false;
        for (let i=0; i<products.length; i++) {
            if (products[i].code == code) isCodeRepeated = true;
        }
        return isCodeRepeated;
    }
    validateProductProperties(product) {
        const propLength = Object.keys(product).length;
        let count = 0;
        if (!!product.title) count++;
        if (!!product.description) count++;
        if (!!product.code) count++;
        if (!!product.price) count++;
        if (!!product.stock) count++;
        if (!!product.category) count++;
        return propLength === count;
    }
    errorForProps(product) {
        if (!!product.title && typeof(product.title)!="string") return "Title is required and must be a string";
        if (!!product.description && typeof(product.description)!="string") return "Description is required and must be a string";
        if (!!product.code && typeof(product.code)!="string") return "Code is required and must be a string";
        if (!!product.price && typeof(product.price)!="number") return "Price is required and must be a number";
        if (!!product.stock && typeof(product.stock)!="number") return "Stock is required and must be a number";
        if (!!product.category && typeof(product.category)!="string") return "Category is required and must be a string";
    }
}