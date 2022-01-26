const { Teams, Dex } = require("pokemon-showdown");
const PokemonData = require("../../../../Stats/pokemon.json");

const generatePokemon = (mon) => {
  var pokemon = PokemonData[mon.toLowerCase()];
  let rand = Math.floor(Math.random() * 10);

  pokemon.name = "";
  pokemon.ivs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  pokemon.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  pokemon.nature = getNature();
  pokemon.item = "";
  pokemon.level = 20;
  pokemon.id = JSON.stringify(Date.now());

  //decide gender
  if (rand <= 4) pokemon.gender = "M";
  else pokemon.gender = "F";

  //randomly assign ivs
  pokemon.ivs.hp = Math.floor(Math.random() * 32);
  pokemon.ivs.atk = Math.floor(Math.random() * 32);
  pokemon.ivs.def = Math.floor(Math.random() * 32);
  pokemon.ivs.spa = Math.floor(Math.random() * 32);
  pokemon.ivs.spd = Math.floor(Math.random() * 32);
  pokemon.ivs.spe = Math.floor(Math.random() * 32);

  const dexData = Dex.species.get(mon);

  //randomly get abillity
  rand = Math.floor(Math.random() * Object.keys(dexData.abilities).length);

  if (dexData.abilities["H"]) {
    if (rand == Object.keys(dexData.abilities).length - 1) rand = "H";

    if (rand != "H") rand = JSON.stringify(rand);
  } else if (Object.keys(dexData.abilities).length == 1) {
    rand = 0;
  }
  //console.log(dexData.abilities);
  pokemon.ability = dexData.abilities[rand];
  //console.log(rand);

  pokemon.types = dexData.types;
  return pokemon;
};

const getNature = () => {
  const natures = [
    "Hardy",
    "Lonely",
    "Brave",
    "Adamant",
    "Naughty",
    "Bold",
    "Docile",
    "Relaxed",
    "Impish",
    "Lax",
    "Timid",
    "Hasty",
    "Serious",
    "Jolly",
    "Naive",
    "Modest",
    "Mild",
    "Quiet",
    "Bashful",
    "Rash",
    "Calm",
    "Gentle",
    "Sassy",
    "Careful",
    "Quirky",
  ];

  let rand = Math.floor(Math.random() * natures.length);

  return natures[rand];
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
