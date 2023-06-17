import { connect } from "mongoose";

const DB_URL = "mongodb+srv://andischus:bienrustico19@andres-cluster.t8midx9.mongodb.net/ecommerce";

export async function connectMongo() {
  try {
    await connect(DB_URL);
    console.log("Connected to MongoDB");
  } catch (e) {
    console.log(e);
    throw "Something went wrong connecting to MongoDB";
  }
}