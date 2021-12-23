const { Dex } = require("pokemon-showdown");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const item = Dex.items.get(id);

      if (!item) res.status(400).json({ data: "Not Found" });
      item["cost"] = 999;
      res.status(200).json({ data: item });
      break;
  }
}
