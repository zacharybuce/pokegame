const { Dex } = require("pokemon-showdown");

//Legendary - 5
const legendary = [
  "Assault Vest",
  "Choice Band",
  "Choice Scarf",
  "Choice Specs",
  "Eviolite",
  "Expert Belt",
  "Leftovers",
];

//Epic - 8
const epic = [
  "Heavy-Duty Boots",
  "Focus Sash",
  "Life Orb",
  "Rocky Helmet",
  "Metronome",
  "Muscle Band",
  "Normal Gem",
  "Shell Bell",
  "Wide Lens",
  "Wise Glasses",
  "Big Root",
];

//Rare - 18
const rare = [
  "Mental Herb",
  "Power Herb",
  "Air Balloon",
  "Black Belt",
  "Black Glasses",
  "Black Sludge",
  "Charcoal",
  "Dragon Fang",
  "Hard Stone",
  "Magnet",
  "Metal Coat",
  "Miracle Seed",
  "Mystic Water",
  "Never-Melt Ice",
  "Twisted Spoon",
  "Pixie Plate",
  "Poison Barb",
  "Sharp Beak",
  "Silk Scarf",
  "Silver Powder",
  "Soft Sand",
  "Weakness Policy",
  "Spell Tag",
];

//Uncommon - 33
const uncommon = [
  "Salac Berry",
  "Wiki Berry",
  "Aguav Berry",
  "Mago Berry",
  "Figy Berry",
  "Iapapa Berry",
  "Bright Powder",
  "Light Clay",
  "Protective Pads",
  "Red Card",
  "Safety Goggles",
  "Starf Berry",
  "Utility Umbrella",
  "Zoom Lens",
];

//Common - 35
const common = [
  "Blunder Policy",
  "Damp Rock",
  "Eject Button",
  "Eject Pack",
  "Full Incense",
  "Heat Rock",
  "Icy Rock",
  "Kings Rock",
  "Scope Lens",
  "Shed Shell",
  "Sitrus Berry",
  "Smooth Rock",
  "White Herb",
];

const generateItems = () => {
  var shopItems = [];
  var item = "";
  for (let i = 0; i < 3; i++) {
    let rand = Math.floor(Math.random() * 100);
    if (rand < 35) {
      rand = Math.floor(Math.random() * common.length);
      item = common[rand];
      console.log(item);
      if (!shopItems.includes(item + "|Common"))
        shopItems.push(item + "|Common");
      else i--;
    }
    if (rand >= 35 && rand < 68) {
      rand = Math.floor(Math.random() * uncommon.length);
      item = uncommon[rand];
      if (!shopItems.includes(item + "|Uncommon"))
        shopItems.push(item + "|Uncommon");
      else i--;
    }
    if (rand >= 68 && rand < 86) {
      rand = Math.floor(Math.random() * rare.length);
      item = rare[rand];
      if (!shopItems.includes(item + "|Rare")) shopItems.push(item + "|Rare");
      else i--;
    }
    if (rand >= 86 && rand < 94) {
      rand = Math.floor(Math.random() * epic.length);
      item = epic[rand];
      if (!shopItems.includes(item + "|Epic")) shopItems.push(item + "|Epic");
      else i--;
    }
    if (rand >= 94) {
      rand = Math.floor(Math.random() * legendary.length);
      item = legendary[rand];
      if (!shopItems.includes(item + "|Legendary"))
        shopItems.push(item + "|Legendary");
      else i--;
    }
  }
  return shopItems;
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      const items = generateItems();
      res.status(200).json({ data: items });
      break;
  }
}
