import Poke from "pokemon-showdown";
import Sim from "pokemon-showdown";
const Teams = Poke.Teams;
const Dex = Poke.Dex;
const battle = new Poke.Battle("gen8ou");

var upTeam = [
  {
    name: "",
    species: "Articuno",
    gender: "",
    item: "Leftovers",
    level: "50",
    ability: "Pressure",
    evs: { hp: 252, atk: 0, def: 0, spa: 252, spd: 4, spe: 0 },
    nature: "Modest",
    ivs: { hp: 31, atk: 31, def: 31, spa: 30, spd: 30, spe: 31 },
    moves: ["Ice Beam", "Hurricane", "Substitute", "Roost"],
  },
];

const mon = {
  name: "",
  species: "Articuno",
  gender: "",
  item: "Leftovers",
  level: "50",
  ability: "Pressure",
  evs: { hp: 252, atk: 0, def: 0, spa: 252, spd: 4, spe: 0 },
  nature: "Modest",
  ivs: { hp: 31, atk: 31, def: 31, spa: 30, spd: 30, spe: 31 },
  moves: ["Ice Beam", "Hurricane", "Substitute", "Roost"],
};

console.log(Dex.items.get("Aguav Berry"));

// const baseStats = Dex.species.get("Articuno").baseStats;
// const poke = battle.spreadModify(baseStats, mon);
// console.log(Dex.species.get("raichu"));

// console.log(Teams.pack(upTeam));

// const p1spec = {
//   name: "alice",
//   team: Teams.pack(upTeam),
// };
// const p2spec = {
//   name: "bob",
//   team: Teams.pack(upTeam),
// };

// var stream = new Sim.BattleStream();

// (async () => {
//   for await (const output of stream) {
//     console.log(output);
//   }
// })();

// stream.write(`>start {"formatid":"gen8ou"}`);
// stream.write(`>player p1 ${JSON.stringify(p1spec)}`);
// stream.write(`>player p2 ${JSON.stringify(p2spec)}`);
// stream.write(`>p1 team 123`);
// stream.write(`>p2 team 123`);
