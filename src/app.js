//@ts-check
import express from 'express';
import { __dirname } from './dirname.js';
import { connectMongo } from './utils/connections.js';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productsRoutes from './routes/products.router.js';
import cartsRoutes from './routes/carts.router.js';
import realtimeRouter from './routes/realtime.router.js';
import productsViewRouter from './routes/productsView.router.js';
import cartViewRouter from './routes/cartView.router.js';
import { routerMessages } from "./routes/messages.router.js";
import { ProductService } from './services/products.service.js';
import { MessageService } from './services/messages.service.js';
import { faker } from '@faker-js/faker';
import { ProductModel } from './daos/models/products.model.js';

connectMongo();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const port = 8080;

const productService = new ProductService();
const messageService = new MessageService();

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '\\views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '\\public'));

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/realtimeproducts", realtimeRouter);
app.use("/chat", routerMessages);
app.use("/products", productsViewRouter)
app.use("/cart", cartViewRouter)

io.on('connection', (socket) => {
  socket.on('add_product', async (newProduct) => {
    try {
      const addedProduct = await productService.addProduct(newProduct);
      io.emit("new_item", addedProduct);
    } catch (err){
      console.log(err);
    }
  });
  socket.on('send_message', async (data) => {
    try {
      const addedMessage = await messageService.addMessage(data);
      io.emit('new_message', addedMessage);
    } catch (err) {
      console.log(err);
    }
  })
})

app.get('*', (req, res) => {
  res.status(404).json({"error": "Page not found."});
});

httpServer.listen(port, () => {
/*   const products = [];
  for (let i = 0; i < 400; i++) {
    products.push({
      title: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      code: faker.string.alphanumeric(10),
      price: faker.commerce.price(),
      stock: faker.number.int(9999),
      category: faker.commerce.productAdjective()
    })
  }
  ProductModel.insertMany(products); */
  console.log(`Server running on port ${port}`);
});