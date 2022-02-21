const encounters = require("../../../../Stats/encounters-kanto-johto.json");
const trainerData = require("../../../../Stats/trainer.json");
export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json({ data: encounters[id] });
      break;
  }
}
