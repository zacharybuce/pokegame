const { Teams, Dex } = require("pokemon-showdown");

const catchMon = (mon) => {
  let bst = Dex.species.get(mon.species.toLowerCase()).bst;
  let rand = Math.floor(Math.random() * 1001);

  if (mon.level <= 20) bst = bst;
  if (mon.level > 20 && mon.level <= 30) bst = bst * 1.1;
  if (mon.level > 30 && mon.level <= 40) bst = bst * 1.2;
  if (mon.level > 40 && mon.level <= 50) bst = bst * 1.25;

  console.log("bst: " + bst);
  console.log("rand: " + rand);
  if (rand > bst) return true;

  return false;
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const caught = catchMon(req.body);
      res.status(200).json({ data: caught });
      break;
  }
}
