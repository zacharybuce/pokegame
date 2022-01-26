// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "*",
//   },
// });
import { Server } from "socket.io";
import { createServer } from "http";
import Battle from "./battle.js";
import WildBattle from "./wildbattle.js";
import { readFile } from "fs/promises";

const monList = JSON.parse(await readFile("../Stats/pokemonStats.json"));

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
var wildBattles = [];
var starterRule = "Classic";
var starters = [];

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

  //lobby rules updates
  socket.on("send-rules-update", (starter, journey) => {
    console.log("rules change - " + starter);

    if (starter == "Random Fair") {
      console.log("generating mon");
      const keys = Object.keys(monList);
      for (let i = 0; i < 3; i++) {
        let rand = Math.floor(Math.random() * keys.length);
        if (!starters.includes(keys[rand])) starters.push(keys[rand]);
        else i--;
      }
      console.log(starters);
    }

    starterRule = starter;
    const rules = { starter: starter, journey: journey };
    io.emit("lobby-rules-update", rules);
  });

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
    console.log("sending starter...");

    if (starterRule == "Random") {
      const keys = Object.keys(monList);
      var genStarters = [];
      for (let i = 0; i < 3; i++) {
        let rand = Math.floor(Math.random() * keys.length);
        if (!genStarters.includes(keys[rand])) genStarters.push(keys[rand]);
        else i--;
      }
      io.to(id).emit("starter-mon", genStarters);
    } else if (starterRule == "Random Fair") {
      io.to(id).emit("starter-mon", starters);
    } else {
      io.to(id).emit("starter-mon", ["Charmander", "Squirtle", "Bulbasaur"]);
    }
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

  socket.on("start-wild-battle", async (id, opponent, oppTeam) => {
    let index = 0;
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        console.log(
          id + "is equal to " + lobby.players[i].name.replace(/['"]+/g, "")
        );
        console.log("The index is " + i);
        index = i;
      }
    }

    let firstP1 = [lobby.players[index].team[0]];

    wildBattles[index] = new WildBattle(
      io,
      playersInLobby[index],
      opponent,
      lobby.players[index].playerSocket,
      firstP1,
      oppTeam,
      endWildBattle,
      index
    );
    console.log("---Starting Battle---");
    const res = await wildBattles[index].startBattle();
    //battleStart = true;
    //console.log("in run");
    wildBattles[index].runBattle();
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
  for (let i = 0; i < 2; i++) {
    if (i == 0) {
      let rand = Math.floor(Math.random() * 100);
      let area = wildArea(round, rand);
      if (!choices.includes(area)) choices.push(area);
      else i--;
    } else {
      let eventType = Math.floor(Math.random() * 100);
      if (eventType >= 70) {
        let rand = Math.floor(Math.random() * 100);
        let area = wildArea(round, rand);
        if (!choices.includes(area)) choices.push(area);
        else i--;
      } else {
        let trainerRand = Math.floor(Math.random() * 100);
        const trainer = trainerBattles(trainerRand);
        choices.push(trainer);
      }
    }
  }
  return choices;
};

const wildArea = (round, num) => {
  var area = "";
  if (round <= 3) {
    area = l1Areas(num);
  } else if (round > 4 && round <= 7) {
    area = l2Areas(num);
  }

  return area;
};

const l1Areas = (num) => {
  if (num < 20) return "Viridian Forest|Common";
  if (20 <= num && num < 40) return "Grassland Route|Common";
  if (40 <= num && num < 60) return "Dark Cave|Common";
  if (60 <= num && num < 75) return "Sprout Tower|Uncommon";
  if (75 <= num && num < 90) return "Mt.Moon|Uncommon";
  if (num >= 90) return "Union Cave|Rare";

  console.log(num);
  return "error";
};

const l2Areas = (num) => {
  if (num < 19) return "Slowpoke Well|Common";
  if (19 <= num && num < 37) return "Ilex Forest|Common";
  if (37 <= num && num < 55) return "Diglett's Cave|Common";
  if (55 <= num && num < 70) return "Rock Tunnel|Uncommon";
  if (70 <= num && num < 85) return "National Park|Uncommon";
  if (85 <= num && num < 90) return "Safari Zone|Rare";
  if (90 <= num && num < 95) return "Ice Path|Rare";
  if (95 <= num && num < 99) return "Power Plant|Epic";
  if (num >= 99) return "Rocket Hideout|Legendary";

  console.log(num);
  return "error";
};

const trainerBattles = (num) => {
  if (num < 40) return "TrainerEasy|Common";
  if (40 <= num && num < 60) return "TrainerMedium|Uncommon";
  if (60 <= num && num < 75) return "TrainerChallenge|Rare";
  if (75 <= num && num < 90) return "TrainerHard|Epic";
  if (num >= 90) return "TrainerImpossible|Legendary";

  console.log(num);
  return "error";
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

const endWildBattle = (index) => {
  console.log("ending the battle");
  wildBattles[index] = null;
};

httpServer.listen(3001);
