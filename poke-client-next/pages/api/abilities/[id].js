const { Dex } = require("pokemon-showdown");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const ability = Dex.abilities.get(id);

      if (!ability) res.status(400).json({ data: "Not Found" });
      res.status(200).json({ data: ability });
      break;
  }
}
