const TrainerData = require("../../../../Stats/trainer.json");

const getTrainer = (TR, round) => {
  var leg = "";

  if (round <= 6) leg = "Leg1";
  if (round >= 7 && round <= 12) leg = "Leg2";
  if (round >= 13) leg = "Leg3";

  const trainers = TrainerData[TR][leg];
  let randTrainer = Math.floor(Math.random() * trainers.length);

  const trainerClass = trainers[randTrainer].trainerClass;
  let randMon = Math.floor(
    Math.random() * trainers[randTrainer].pokemon.length
  );
  const trainerMon = trainers[randTrainer].pokemon[randMon];

  return { trainerClass: trainerClass, pokemon: trainerMon };
};

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      const TR = req.body.trainerRarity;
      const round = req.body.round;

      const trainer = getTrainer(TR, round);

      res.status(200).json({ data: trainer });
      break;
  }
}
