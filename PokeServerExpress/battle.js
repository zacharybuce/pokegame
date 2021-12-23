import Sim from "pokemon-showdown";
const stream = new Sim.BattleStream();

export default class Battle {
  constructor(io, player1, player2, socket1, socket2) {
    this.playerArr = [];
    this.playerArr.push(player1);
    this.playerArr.push(player2);
    this.io = io;
    this.socket1 = socket1;
    this.socket2 = socket2;
  }
  startBattle() {
    stream.write(`>start {"formatid":"gen7randombattle"}`);
    stream.write(`>player p1 {"name":${this.playerArr[0]}}`);
    stream.write(`>player p2 {"name":${this.playerArr[1]}}`);
  }

  runBattle() {
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
        console.log("-->" + output);
        var tokens = output.split("|");

        console.log(tokens);

        if (tokens[0].includes("sideupdate")) {
          if (tokens[0].includes("p1")) {
            console.log("sending team to p1");
            this.io.to(this.playerArr[0]).emit("side-update", tokens[2], true);
          } else {
            console.log("sending team to p2");
            this.io.to(this.playerArr[1]).emit("side-update", tokens[2], false);
          }
        } else if (tokens[0].includes("update")) {
          console.log("in update");
          this.io.emit("update", output);
        }
      }
    })();
  }
}
