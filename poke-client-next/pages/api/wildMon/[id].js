const encounters = require("../../../../Stats/encounters-kanto-johto.json");

const getWild = (location) => {
  let rand = Math.floor(Math.random() * 100);
  const data = encounters[location];
  var total = 0;
  var mon = "";
  for (let i = 0; i < data.rates.length; i++) {
    total += data.rates[i];
    if (rand < total) {
      mon = data.pokemon[i];
      break;
    }
  }
  return mon;
};

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const pokemon = getWild(id);
      res.status(200).json({ data: pokemon });
      break;
  }
}
