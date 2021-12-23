// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "*",
//   },
// });
import { Server } from "socket.io";
import { createServer } from "http";
import Battle from "./battle.js";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

var playersInLobby = [];
var lobby = {
  round: 0,
  players: [],
};
var readyToStart = 0;
var gameStart = false;
var battleStart = false;
var battle = null;

io.on("connection", (socket) => {
  //put every player in their own room. id= player selected-id
  const id = JSON.stringify(socket.handshake.query.id);
  socket.join(id);

  //add players to lobby
  if (!playersInLobby.includes(id)) {
    lobby.players.push({
      name: id,
      score: 0,
      ready: false,
      playerSocket: socket,
    });
    playersInLobby.push(id);
    io.emit("player-joined", playersInLobby);
    console.log(id + " joined the lobby");
  }

  //ready to start game
  socket.on("send-ready", () => {
    readyToStart += 1;
    console.log("---Someone is ready!---");

    startGameIfReady();
    if (gameStart) {
      // battle = new Battle(
      //   io,
      //   playersInLobby[0],
      //   playersInLobby[1],
      //   lobby.players[0].playerSocket,
      //   lobby.players[1].playerSocket
      // );
      // battle.startBattle();
      // console.log("---Starting Battle---");
      // battleStart = true;
      // if (battleStart && battle != null) {
      //   console.log("in run");
      //   battle.runBattle();
      // }
      lobbyUpdate();
    }
  });

  socket.on("get-starter", () => {
    io.to(id).emit("starter-mon", ["Squirtle", "Charmander", "Bulbasaur"]);
  });

  //A player indicates that they have finished with their round
  socket.on("round-finish", (id) => {
    readyToStart += 1;

    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].ready = true;
      }
    }

    io.emit("lobby-update", lobby);

    checkForNewRound();
  });
});

const lobbyUpdate = () => {
  lobby.players.map((player, index) => {
    player.playerSocket = "";
    lobby.players[index] = player;
  });

  io.emit("lobby-update", lobby);
};

const checkForNewRound = () => {
  //update players with lobby info - Beginning of Round
  if (readyToStart == lobby.players.length && gameStart) {
    //reset ready states of player
    for (var player of lobby.players) {
      lobby.players[player].ready = false;
    }
    //increment round
    lobby.round += 1;

    io.emit("lobby-update", lobby);
    readyToStart = 0;
  }
};

const game = (socket, id) => {
  //Generate Wild Pokemon Areas on non battle rounds
  if (lobby.round % 3 != 0) {
    var wildAreaOptions = genWildAreas(lobby.round);
    socket.to(id).emit("wild-area-options", wildAreaOptions);
  }
};

const genWildAreas = (round) => {
  var choices = [];
  for (let i = 0; i < 3; i++) {
    let rand = Math.floor(Math.random() * 10);
    choices.push(wildArea(round, rand));
  }
  return choices;
};

const wildArea = (round, num) => {
  var area = "";
  if (round < 3) {
    switch (num) {
      case 0:
      case 1:
      case 2:
        area = "forest";
        break;
      case 3:
      case 4:
      case 5:
        area = "Grassland";
        break;
      case 6:
      case 7:
      case 8:
        area = "Desert";
        break;
      case 9:
        area = "Beach";
        break;
    }
  }
};

const startGameIfReady = () => {
  console.log("Players Ready: " + readyToStart);
  console.log("Player Amount: " + lobby.players.length);

  //start game if everyone is ready
  if (readyToStart == lobby.players.length && !gameStart) {
    io.emit("start-game", true);
    gameStart = true;
    readyToStart = 0;
    console.log("---Game has Started---");
  }
};

httpServer.listen(3001);
