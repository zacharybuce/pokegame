import Sim from "pokemon-showdown";
import Poke from "pokemon-showdown";
const Teams = Poke.Teams;
const stream = new Sim.BattleStream();

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

export default class Battle {
  constructor(io, player1, player2, socket1, socket2, team1, team2, endBattle) {
    this.playerArr = [];
    this.playerArr.push(player1);
    this.playerArr.push(player2);
    this.io = io;
    this.socket1 = socket1;
    this.socket2 = socket2;
    this.teamprev = false;
    this.team1 = team1;
    this.team2 = team2;
    this.endBattle = endBattle;
  }
  startBattle() {
    const p1spec = {
      name: this.playerArr[0],
      team: Teams.pack(this.team1),
    };
    const p2spec = {
      name: this.playerArr[1],
      team: Teams.pack(this.team2),
    };

    stream.write(`>start {"formatid":"gen8ou"}`);
    stream.write(`>player p1 ${JSON.stringify(p1spec)}`);
    stream.write(`>player p2 ${JSON.stringify(p2spec)}`);
    stream.write(`>p1 team 123`);
    stream.write(`>p2 team 123`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("foo");
      }, 300);
    });
  }

  runBattle() {
    console.log("--Running Battle--");
    if (this.socket1 && this.socket2) console.log("sockets loaded");
    this.socket1.on("send-move", (message, id) => {
      console.log("Move from " + id + ": " + message);
      if (this.playerArr[0] == JSON.stringify(id)) {
        stream.write(`>p1 move ${message}`);
        console.log("wrote to sream p1");
      } else {
        stream.write(`>p2 move ${message}`);
        console.log("wrote to sream p2");
      }
    });
    this.socket2.on("send-move", (message, id) => {
      console.log("Move from " + id + ": " + message);
      if (this.playerArr[0] == JSON.stringify(id)) {
        stream.write(`>p1 move ${message}`);
        console.log("wrote to sream p1");
      } else {
        stream.write(`>p2 move ${message}`);
        console.log("wrote to sream p2");
      }
    });

    this.socket1.on("send-switch", (message, id) => {
      console.log("Switch from " + id + ": " + message);
      console.log(this.playerArr);
      if (this.playerArr[0] == JSON.stringify(id)) {
        stream.write(`>p1 switch ${message}`);
        console.log("wrote to sream p1");
      } else {
        stream.write(`>p2 switch ${message}`);
        console.log("wrote to sream p2");
      }
    });

    this.socket2.on("send-switch", (message, id) => {
      console.log("Switch from " + id + ": " + message);
      console.log(this.playerArr);
      if (this.playerArr[0] == JSON.stringify(id)) {
        stream.write(`>p1 switch ${message}`);
        console.log("wrote to sream p1");
      } else {
        stream.write(`>p2 switch ${message}`);
        console.log("wrote to sream p2");
      }
    });

    //Battle Stream
    (async () => {
      for await (const output of stream) {
        var tokens = output.split("|");

        if (this.teamprev) {
          if (tokens[0].includes("sideupdate")) {
            if (tokens[0].includes("p1")) {
              console.log("sending team to p1");
              this.io
                .to(this.playerArr[0])
                .emit("side-update", tokens[2], true);
            } else {
              console.log("sending team to p2");
              this.io
                .to(this.playerArr[1])
                .emit("side-update", tokens[2], false);
            }
          } else if (tokens[0].includes("update")) {
            console.log("in update");
            this.io.emit("update", output);
          }
        }
        if (tokens[tokens.length - 1].includes("teampreview")) {
          this.teamprev = true;
          //console.log("IN---");
        }

        if (tokens.includes("win")) {
          this.endBattle();
        }
      }
    })();
  }
}
