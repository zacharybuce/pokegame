import Sim from "pokemon-showdown";
import Poke from "pokemon-showdown";

const Teams = Poke.Teams;

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

export default class WildBattle {
  constructor(
    io,
    player,
    opponent,
    socket,
    playerTeam,
    oppTeam,
    endBattle,
    index
  ) {
    this.player = player;
    this.opponent = opponent;
    this.io = io;
    this.socket = socket;
    this.teamprev = false;
    this.playerTeam = playerTeam;
    this.oppTeam = oppTeam;
    this.endBattle = endBattle;
    this.index = index;
    this.stream = new Sim.BattleStream();
  }
  startBattle() {
    const p1spec = {
      name: this.player,
      team: Teams.pack(this.playerTeam),
    };
    const p2spec = {
      name: this.opponent,
      team: Teams.pack(this.oppTeam),
    };

    this.stream.write(`>start {"formatid":"gen8ou"}`);
    this.stream.write(`>player p1 ${JSON.stringify(p1spec)}`);
    this.stream.write(`>player p2 ${JSON.stringify(p2spec)}`);
    this.stream.write(`>p1 team 1`);
    this.stream.write(`>p2 team 1`);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("foo");
      }, 300);
    });
  }

  runBattle() {
    console.log("--Running Battle--");
    if (this.socket) console.log("sockets loaded");
    this.socket.on("send-move", (message, id) => {
      console.log("Move from " + id + ": " + message);
      this.stream.write(`>p1 move ${message}`);
      console.log("wrote to sream p1");
      let rand = Math.floor(Math.random() * 4);
      this.stream.write(`>p2 move ${rand + 1}`);
    });

    this.socket.on("send-switch", (message, id) => {
      console.log("Switch from " + id + ": " + message);
      console.log(this.playerArr);
      this.stream.write(`>p1 switch ${message}`);
      console.log("wrote to sream p1");
    });

    //Battle Stream
    (async () => {
      for await (const output of this.stream) {
        var tokens = output.split("|");
        //console.log(tokens);
        // if (this.teamprev) {
        if (tokens[0].includes("sideupdate")) {
          if (tokens[0].includes("p1")) {
            console.log("sending team to p1");
            this.io.to(this.player).emit("side-update", tokens[2], true);
          }
        } else if (tokens[0].includes("update")) {
          console.log("in update");
          this.io.to(this.player).emit("update", output);
        }
        //  }
        // if (tokens[tokens.length - 1].includes("teampreview")) {
        //   this.teamprev = true;
        //   //console.log("IN---");
        // }

        if (tokens.includes("win")) {
          this.endBattle(this.index);
        }
      }
    })();
  }
}
