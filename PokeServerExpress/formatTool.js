import Poke from "pokemon-showdown";
import Sim from "pokemon-showdown";
import RandomPlayerAI from "../PokeServerExpress/node_modules/pokemon-showdown/.sim-dist/tools/random-player-ai.js";
import { readFile, writeFile } from "fs/promises";

const Teams = Poke.Teams;
const Dex = Poke.Dex;
const battle = new Poke.Battle("gen8ou");

var allMon = {};
const showdownMon = Dex.species.all();
// const monList = JSON.parse(await readFile("./all.json"));

//console.log(Dex.species.get("Raichu-Alola"));
var total = 649;
for (let i = 0; i < total; i++) {
  if (
    showdownMon[i].forme == "" ||
    showdownMon[i].forme == "Alola" ||
    showdownMon[i].forme == "Galar"
  ) {
    let mon = showdownMon[i].name.toLowerCase();
    if (monList[mon]) {
      allMon[mon] = monList[mon];
    } else {
      allMon[mon] = {
        species: showdownMon[i].name,
        moves: [],
        evolveCandy: "",
      };
    }
    if (showdownMon[i].forme == "Alola" || showdownMon[i].forme == "Galar") {
      total++;
    }
  } else {
    total++;
  }
}

console.log(allMon);
writeFile("pokemon.json", JSON.stringify(allMon), "utf8");
