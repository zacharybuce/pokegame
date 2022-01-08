const PokemonData = require("../../../pokemonStats.json");

const randPoke = () => {
  let rand = Math.floor(Math.random() * 101);
  //if(rand)
};

const getPoke = (wildArea) => {
  switch (wildArea) {
    case "Viridian Forest":
      return "Pikachu";
    case "Grassland Route":
      return "Pikachu";
    case "Mt.Moon":
      return "Pikachu";
    case "Dark Cave":
      return "Pikachu";
  }
};

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const pokemon = getPoke(id);
      res.status(200).json({ data: pokemon });
      break;
  }
}
