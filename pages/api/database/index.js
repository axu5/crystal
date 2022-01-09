import { MongoClient } from "mongodb";

let loaded = false;
let db = null;
async function loadDb() {
  if (loaded) return db;

  const uri = process.env.DB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  db = client.db(process.env.DB_NAME);

  console.log("✅ connected to mongodb");
  loaded = true;

  return db;
}

export default async function getDb() {
  const client = await loadDb();

  return {
    users: await client.collection("users"),
    sessions: await client.collection("sessions"),
    products: await client.collection("products"),
    discounts: await client.collection("discounts"),
    orders: await client.collection("orders"),
  };
}
