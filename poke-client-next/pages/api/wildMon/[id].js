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
