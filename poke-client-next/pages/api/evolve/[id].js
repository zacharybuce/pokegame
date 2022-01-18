const { Dex } = require("pokemon-showdown");
const EvoData = require("../../../pokemonEvolutions.json");

const evolvePokemon = (poke) => {
  const evoSpecies = Dex.species.get(poke).evos;
  var evo = "";

  if (evoSpecies.length > 1) {
    let rand = Math.floor(Math.random() * evoSpecies.length);
    evo = evoSpecies[rand];
  } else {
    evo = evoSpecies[0];
  }

  const evoData = EvoData[evo.toLocaleLowerCase()];
  evoData.types = Dex.species.get(evo).types;
  return evoData;
};

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const pokemon = evolvePokemon(id);
      res.status(200).json({ data: pokemon });
      break;
  }
}
