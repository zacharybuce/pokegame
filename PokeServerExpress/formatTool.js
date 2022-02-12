import Poke from "pokemon-showdown";
import Sim from "pokemon-showdown";
import RandomPlayerAI from "../PokeServerExpress/node_modules/pokemon-showdown/.sim-dist/tools/random-player-ai.js";
import { readFile, writeFile } from "fs/promises";

const Teams = Poke.Teams;
const Mon = Poke.Pokemon;
const Dex = Poke.Dex;
const battle = new Poke.Battle("gen8ou");
// var allMon = {};
// const showdownMon = Dex.species.all();
// const monList = JSON.parse(await readFile("./all.json"));

// console.log(Dex.species.get("bulbasaur"));
// Dex.getImmunity("Ghost", ["Normal"]);
// console.log(Dex.getEffectiveness("Normal", ["Rock"]));
// console.log(Dex.moves.get("Ember"));
// var total = 649;
// for (let i = 0; i < total; i++) {
//   if (
//     showdownMon[i].forme == "" ||
//     showdownMon[i].forme == "Alola" ||
//     showdownMon[i].forme == "Galar"
//   ) {
//     let mon = showdownMon[i].name.toLowerCase();
//     if (monList[mon]) {
//       allMon[mon] = monList[mon];
//     } else {
//       allMon[mon] = {
//         species: showdownMon[i].name,
//         moves: [],
//         evolveCandy: "",
//       };
//     }
//     if (showdownMon[i].forme == "Alola" || showdownMon[i].forme == "Galar") {
//       total++;
//     }
//   } else {
//     total++;
//   }
// }

// console.log(allMon);
// writeFile("pokemon.json", JSON.stringify(allMon), "utf8");

// const monList = JSON.parse(await readFile("../stats/pokemon.json"));
// const keys = Object.keys(monList);
// var newMon = {};

// for (let i = 0; i < keys.length; i++) {
//   let mon = monList[keys[i]];

//   if (monList[keys[i]].newMoves) {
//     if (keys[i].charAt(keys[i].length - 1) == "2") {
//       mon.level = 30;
//     } else {
//       if (monList[Dex.species.get(keys[i]).prevo.toLowerCase()]) {
//         mon.level = 23;
//       }
//     }
//   }

//   newMon[keys[i]] = mon;
// }

// for (let i = 0; i < keys.length; i++) {
//   let mon = monList[keys[i]];

//   newMon[keys[i]] = mon;
// }

// console.log(newMon);

console.log(
  Teams.import(
    "Articuno||leftovers|pressure|icebeam,hurricane,substitute,roost|Modest|252,,,252,4,||,,,30,30,|S||"
  )
);
