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
  newRound: false,
};
var sendLobby = {
  round: 0,
  players: [],
  newRound: false,
};
var readyToStart = 0;
var readyToBattle = 0;
var gameStart = false;
var battleStart = false;
var battle = null;

io.on("connection", (socket) => {
  //put every player in their own room. id= player selected-id
  const id = JSON.stringify(socket.handshake.query.id);
  socket.join(id);

  //add players to lobby
  if (!playersInLobby.includes(id) && JSON.parse(id) != "undefined") {
    lobby.players.push({
      name: id,
      score: 0,
      team: [],
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
      lobbyUpdate();
    }
  });

  //player indicates they want a group of 3 starters to pick from
  socket.on("get-starter", () => {
    io.to(id).emit("starter-mon", ["Squirtle", "Charmander", "Bulbasaur"]);
  });

  //A player indicates that they have finished with their round
  socket.on("round-finish", (id) => {
    console.log(id + " has ended their turn");

    readyToStart += 1;

    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].ready = true;
      }
    }

    //lobbyUpdate();

    checkForNewRound();
  });

  //A player indicates they are ready to start a trainer battle
  socket.on("trainer-battle-start", (id) => {
    readyToBattle += 1;

    if (readyToBattle == playersInLobby.length) startTrainerBattle();
  });

  //A players team has changed and it is updating the server with the new team
  socket.on("update-team", (id, team) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].team = team;
        console.log(id + "team is: " + team);
      }
    }
  });

  socket.on("get-wild-areas", (id1) => {
    var wildAreaOptions = genWildAreas(lobby.round);
    console.log("sending wild areas to " + id);
    console.log(wildAreaOptions);
    io.to(id).emit("wild-area-options", wildAreaOptions);
  });
});

const startTrainerBattle = async () => {
  if (lobby.round === 4 || lobby.round === 8 || lobby.round === 12) {
    battle = new Battle(
      io,
      playersInLobby[0],
      playersInLobby[1],
      lobby.players[0].playerSocket,
      lobby.players[1].playerSocket,
      lobby.players[0].team,
      lobby.players[1].team,
      endBattle
    );
    console.log("---Starting Battle---");
    const res = await battle.startBattle();
    battleStart = true;
    //console.log("in run");
    battle.runBattle();
  }
};

const lobbyUpdate = () => {
  sendLobby.round = lobby.round;
  sendLobby.newRound = lobby.newRound;

  lobby.players.map((player, index) => {
    sendLobby.players[index] = {
      name: player.name,
      score: player.score,
      ready: player.ready,
    };
  });

  console.log("sending a lobby update");
  io.emit("lobby-update", sendLobby);
};

const checkForNewRound = () => {
  //update players with lobby info - Beginning of Round
  if (readyToStart == lobby.players.length && gameStart) {
    //reset ready states of player
    for (let i = 0; i < lobby.players.length; i++) {
      lobby.players[i].ready = false;
    }
    //increment round
    lobby.round += 1;
    lobby.newRound = true;

    console.log("NEW ROUND");

    lobbyUpdate();

    readyToStart = 0;
    lobby.newRound = false;
  } else {
    lobbyUpdate();
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
    let area = wildArea(round, rand);
    if (!choices.includes(area)) choices.push(area);
    else i--;
  }
  return choices;
};

const wildArea = (round, num) => {
  var area = "";
  if (round <= 3) {
    switch (num) {
      case 0:
      case 1:
      case 2:
        area = "Viridian Forest";
        break;
      case 3:
      case 4:
      case 5:
        area = "Grassland Route";
        break;
      case 6:
      case 7:
      case 8:
        area = "Mt.Moon";
        break;
      case 9:
        area = "Dark Cave";
        break;
    }
  }

  return area;
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

const endBattle = () => {
  console.log("ending the battle");
  battleStart = false;
  readyToBattle = 0;
  battle = null;
};

httpServer.listen(3001);
