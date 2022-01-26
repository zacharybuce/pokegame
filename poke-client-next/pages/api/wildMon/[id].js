const encounters = require("../../../../Stats/encounters-kanto-johto.json");

const ViridianForest = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 30) return "Caterpie";
  if (30 <= rand && rand < 60) return "Weedle";
  if (60 <= rand && rand < 85) return "Spinarak";
  if (85 <= rand && rand < 95) return "Shroomish";
  if (rand >= 95) return "Pikachu";
};

const GrasslandRoute = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 25) return "Pidgey";
  if (25 <= rand && rand < 50) return "Sentret";
  if (50 <= rand && rand < 75) return "Oddish";
  if (75 <= rand && rand < 95) return "Growlithe";
  if (rand >= 95) return "Jigglypuff";
};

const DarkCave = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 30) return "Magikarp";
  if (25 <= rand && rand < 50) return "Teddiursa";
  if (50 <= rand && rand < 75) return "Ponyta";
  if (75 <= rand && rand < 95) return "Krabby";
  if (75 <= rand && rand < 95) return "Shuckle";
  if (rand >= 95) return "Dunsparce";
};

const UnionCave = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 26) return "Sandshrew";
  if (26 <= rand && rand < 51) return "Wooper";
  if (51 <= rand && rand < 68) return "Onix";
  if (68 <= rand && rand < 85) return "Krabby";
  if (85 <= rand && rand < 95) return "Corsola";
  if (95 <= rand && rand < 99) return "Staryu";
  if (rand >= 99) return "Lapras";
};

const SproutTower = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 30) return "Rattata";
  if (30 <= rand && rand < 60) return "Bellsprout";
  if (60 <= rand && rand < 85) return "Hoothoot";
  if (85 <= rand && rand < 99) return "Gastly";
  if (rand >= 99) return "Meditite";
};

const MtMoon = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 35) return "Zubat";
  if (35 <= rand && rand < 69) return "Geodude";
  if (69 <= rand && rand < 94) return "Paras";
  if (94 <= rand && rand < 99) return "Makuhita";
  if (rand >= 99) return "Clefairy";
};

const SlowpokeWell = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 30) return "Slowpoke";
  if (30 <= rand && rand < 60) return "Goldeen";
  if (60 <= rand && rand < 80) return "Poliwag";
  if (80 <= rand && rand < 95) return "Psyduck";
  if (rand >= 95) return "Bronzor";
};

const IlexForest = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 35) return "Oddish";
  if (35 <= rand && rand < 70) return "Pineco";
  if (70 <= rand && rand < 90) return "Tangela";
  if (90 <= rand && rand < 99) return "Numel";
  if (rand >= 99) return "Heracross";
};

const DiglettsCave = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 60) return "Diglett";
  if (60 <= rand && rand < 75) return "Chingling";
  if (75 <= rand && rand < 90) return "Rhyhorn";
  if (90 <= rand && rand < 99) return "Magmar";
  if (rand >= 99) return "Absol";
};

const RockTunnel = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 30) return "Cubone";
  if (30 <= rand && rand < 60) return "Machop";
  if (60 <= rand && rand < 80) return "Onix";
  if (80 <= rand && rand < 90) return "Makuhita";
  if (rand >= 90) return "Charmander";
};

const NationalPark = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 27) return "Venonat";
  if (27 <= rand && rand < 55) return "Ledyba";
  if (55 <= rand && rand < 90) return "Exeggcute";
  if (90 <= rand && rand < 99) return "Nincada";
  if (rand >= 99) return "Pinsir";
};

const SafariZone = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 24) return "Doduo";
  if (24 <= rand && rand < 47) return "Nidoran-M";
  if (47 <= rand && rand < 70) return "Nidoran-F";
  if (70 <= rand && rand < 90) return "Tauros";
  if (90 <= rand && rand < 98) return "Kangaskhan";
  if (98 <= rand && rand < 99) return "Chansey";
  if (rand >= 99) return "Scyther";
};

const IcePath = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 50) return "Swinub";
  if (50 <= rand && rand < 80) return "Delibird";
  if (80 <= rand && rand < 95) return "Jynx";
  if (rand >= 95) return "Sneasel";
};

const PowerPlant = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 27) return "Pikachu";
  if (27 <= rand && rand < 53) return "Magnemite";
  if (53 <= rand && rand < 79) return "Voltorb";
  if (79 <= rand && rand < 94) return "Electabuzz";
  if (rand >= 94) return "Shinx";
};

const RocketHideout = () => {
  let rand = Math.floor(Math.random() * 100);
  if (rand < 25) return "Abra";
  if (25 <= rand && rand < 50) return "Porygon";
  if (50 <= rand && rand < 74) return "Scyther";
  if (74 <= rand && rand < 99) return "Pinsir";
  if (rand >= 99) return "Dratini";
};

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

const getPoke = (wildArea) => {
  switch (wildArea) {
    case "Viridian Forest":
      return ViridianForest();
    case "Grassland Route":
      return GrasslandRoute();
    case "Mt.Moon":
      return MtMoon();
    case "Dark Cave":
      return DarkCave();
    case "Sprout Tower":
      return SproutTower();
    case "Union Cave":
      return UnionCave();
    case "Slowpoke Well":
      return SlowpokeWell();
    case "Ilex Forest":
      return IlexForest();
    case "Diglett's Cave":
      return DiglettsCave();
    case "Rock Tunnel":
      return RockTunnel();
    case "National Park":
      return NationalPark();
    case "Safari Zone":
      return SafariZone();
    case "Ice Path":
      return IcePath();
    case "Power Plant":
      return PowerPlant();
    case "Rocket Hideout":
      return RocketHideout();
  }
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
