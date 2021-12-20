const { Dex } = require("pokemon-showdown");

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const pokemon = Dex.species.get(id);

      if (!pokemon) res.status(400).json({ data: "Not Found" });
      res.status(200).json({ data: pokemon });
      break;
  }
}
