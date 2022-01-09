export default function sanitizeItems(items) {
  return items.map(item => {
    delete item["_id"];
    delete item["tags"];
    delete item["sold"];

    return item;
  });
}
