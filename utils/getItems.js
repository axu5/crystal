import getDb from "../pages/api/database";

export default async function getItems(query) {
  const { products } = await getDb();
  const arr = await (await products.find(query)).toArray();
  return arr.map(item => {
    delete item["_id"];
    return item;
  });
}
