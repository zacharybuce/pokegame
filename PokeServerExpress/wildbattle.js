import Sim from "pokemon-showdown";
import Poke from "pokemon-showdown";

const Teams = Poke.Teams;
const Dex = Poke.Dex;

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
    this.aiState = [];
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
    console.log(this.oppTeam);
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
      if (this.stream != null) {
        console.log("Move from " + id + ": " + message);
        this.stream.write(`>p1 move ${message}`);
        console.log("wrote to sream p1");
        this.stream.write(`>p2 move ${this.aiChoice()}`);
      }
    });

    this.socket.on("send-switch", (message, id) => {
      if (this.stream != null) {
        console.log("Switch from " + id + ": " + message);
        console.log(this.playerArr);
        this.stream.write(`>p1 switch ${message}`);
        console.log("wrote to sream p1");
      }
    });

    this.socket.on("end-wild-battle", (id) => {
      this.endBattle(this.index);
      this.stream = null;
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
          if (tokens[0].includes("p2")) {
            console.log("sending team to p2");
            this.aiState = tokens[2];
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

  aiChoice() {
    var playerPokeType = Dex.species.get(this.playerTeam[0].species).types;
    var aiMoves = JSON.parse(this.aiState);
    aiMoves = aiMoves.active[0].moves;
    var movePowers = {};

    for (let i = 0; i < aiMoves.length; i++) {
      let move = Dex.moves.get(aiMoves[i].move);
      let power = move.basePower;
      switch (Dex.getEffectiveness(move.type, playerPokeType)) {
        case 1:
          power *= 2;
          break;
        case 0:
          break;
        case -1:
          power /= 2;
          break;
      }
      if (this.oppTeam[0].types.includes(move.type)) power *= 1.5;
      if (!Dex.getImmunity(move.type, playerPokeType)) power = 0;

      movePowers[i + 1] = power;
    }

    var bestMove = 1;
    for (let i = 1; i <= 4; i++) {
      if (movePowers[i] > movePowers[bestMove]) bestMove = i;
    }

    if (movePowers[bestMove] <= 1) {
      let rand = Math.floor(Math.random() * 100);
      if (rand < 25) {
        bestMove = Math.floor(Math.random() * aiMoves.length) + 1;
      }
    }

    return bestMove;
  }
}
