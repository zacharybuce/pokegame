const { Teams, Dex, Battle } = require("pokemon-showdown");

const generateStats = (mon) => {
  const battle = new Battle("gen8ou");
  const baseStats = Dex.species.get(mon.species).baseStats;

  return battle.spreadModify(baseStats, mon);
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const stats = generateStats(req.body);
      res.status(200).json({ data: stats });
      break;
  }
}
