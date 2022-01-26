const { Dex } = require("pokemon-showdown");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const nature = Dex.natures.get(id);

      if (!nature) res.status(400).json({ data: "Not Found" });
      res.status(200).json({ data: nature });
      break;
  }
}
