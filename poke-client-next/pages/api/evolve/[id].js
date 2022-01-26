const { Dex } = require("pokemon-showdown");
const EvoData = require("../../../../Stats/pokemon.json");

const evolvePokemon = (poke) => {
  const evoSpecies = Dex.species.get(poke).evos;
  var evo = "";

  if (evoSpecies.length > 1) {
    let rand = Math.floor(Math.random() * evoSpecies.length);
    evo = evoSpecies[rand];
  } else if (evoSpecies.length == 1) {
    evo = evoSpecies[0];
  } else {
    evo = poke + "2";
  }

  const evoData = EvoData[evo.toLowerCase()];

  if (evoSpecies.length >= 1) {
    //get new typing
    evoData.types = Dex.species.get(evoData.species).types;

    //get new ability if applicable
    const prevo = Dex.species.get(evoData.species).prevo;
    if (
      JSON.stringify(Dex.species.get(evoData.species).abilities) !=
        JSON.stringify(Dex.species.get(prevo).abilities) &&
      prevo.length
    ) {
      let abilities = Dex.species.get(evoData.species).abilities;
      let rand = Math.floor(Math.random() * Object.keys(abilities).length);
      if (abilities["H"]) {
        if (rand == Object.keys(abilities).length - 1) rand = "H";

        if (rand != "H") rand = JSON.stringify(rand);
      } else if (Object.keys(abilities).length == 1) {
        rand = 0;
      }
      evoData.ability = abilities[rand];
    }
  }

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
