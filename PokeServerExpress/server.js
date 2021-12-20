const Sim = require("pokemon-showdown");
const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});

stream = new Sim.BattleStream();
players = 0;

(async () => {
  for await (const output of stream) {
    console.log("-->" + output);
    tokens = output.split("|");

    console.log(tokens);

    if (tokens[0].includes("sideupdate")) {
      if (tokens[0].includes("p1")) {
        console.log("sending team to p1");
        io.to(playerArr[0]).emit("side-update", tokens[2], true);
      } else {
        console.log("sending team to p2");
        io.to(playerArr[1]).emit("side-update", tokens[2], false);
      }
    } else if (tokens[0].includes("update")) {
      console.log("in update");
      io.emit("update", output);
    }
  }
})();

stream.write(`>start {"formatid":"gen7randombattle"}`);

playerArr = [];

io.on("connection", (socket) => {
  const id = JSON.stringify(socket.handshake.query.id);
  socket.join(id);

  if (playerArr.length < 2) assignTrainers(id);
  console.log("connection made with id: " + id);

  socket.on("send-move", (message, id) => {
    console.log("Move from " + id + ": " + message);
    console.log(playerArr);
    if (playerArr[0] == JSON.stringify(id)) {
      stream.write(`>p1 move ${message}`);
      console.log("wrote to sream p1");
    } else {
      stream.write(`>p2 move ${message}`);
      console.log("wrote to sream p2");
    }
  });

  socket.on("send-switch", (message, id) => {
    console.log("Switch from " + id + ": " + message);
    console.log(playerArr);
    if (playerArr[0] == JSON.stringify(id)) {
      stream.write(`>p1 switch ${message}`);
      console.log("wrote to sream p1");
    } else {
      stream.write(`>p2 switch ${message}`);
      console.log("wrote to sream p2");
    }
  });
});

const assignTrainers = (id) => {
  if (players === 0) {
    stream.write(`>player p1 {"name":${id}}`);
    players += 1;
  } else stream.write(`>player p2 {"name":${id}}`);
  playerArr.push(id);
};
