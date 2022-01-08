const { Teams, Dex } = require("pokemon-showdown");
const PokemonData = require("../../../pokemonStats.json");

const generatePokemon = (mon) => {
  var pokemon = PokemonData[mon.toLowerCase()];
  let rand = Math.floor(Math.random() * 10);

  pokemon.name = "";
  pokemon.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  pokemon.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  pokemon.nature = "";
  pokemon.item = "";
  pokemon.level = 20;

  if (rand <= 4) pokemon.gender = "M";
  else pokemon.gender = "F";

  pokemon.ivs.hp = Math.floor(Math.random() * 32);
  pokemon.ivs.atk = Math.floor(Math.random() * 32);
  pokemon.ivs.def = Math.floor(Math.random() * 32);
  pokemon.ivs.spa = Math.floor(Math.random() * 32);
  pokemon.ivs.spd = Math.floor(Math.random() * 32);
  pokemon.ivs.spe = Math.floor(Math.random() * 32);

  const dexData = Dex.species.get(mon);

  rand = Math.floor(Math.random() * Object.keys(dexData.abilities).length);
  if (rand == Object.keys(dexData.abilities).length - 1) rand = "H";

  if (rand != "H") rand = JSON.stringify(rand);

  //console.log(dexData.abilities);
  pokemon.ability = dexData.abilities[rand];
  //console.log(rand);

  pokemon.types = dexData.types;
  return pokemon;
};

export default function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      const pokemon = generatePokemon(id);
      res.status(200).json({ data: pokemon });
      break;
  }
}
