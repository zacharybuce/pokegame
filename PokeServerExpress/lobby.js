// const io = require("socket.io")(3001, {
//   cors: {
//     origin: "*",
//   },
// });
import { Server } from "socket.io";
import { createServer } from "http";
import Battle from "./battle.js";
import WildBattle from "./wildbattle.js";
import Trade from "./trade.js";
import { readFile } from "fs/promises";

const monList = JSON.parse(await readFile("../Stats/pokemon.json"));
const setup = JSON.parse(await readFile("./setup.json"));

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
var battle = [];
var wildBattles = [];
var trades = [];
var starterRule = "Classic";
var wildAreaRule = "Classic";
var starters = [];
var overWorldSprites = [
  "AceTrainerF",
  "AceTrainerM",
  "Artist",
  "BattleGirl",
  "SnowTrainer",
];

io.on("connection", (socket) => {
  //put every player in their own room. id= player selected-id
  const id = JSON.stringify(socket.handshake.query.id);
  socket.join(id);

  let randSprite = Math.floor(Math.random() * overWorldSprites.length);
  //add players to lobby
  if (!playersInLobby.includes(id) && JSON.parse(id) != "undefined") {
    lobby.players.push({
      name: id,
      score: 0,
      candiesSpent: 0,
      npcBattlesWon: 0,
      playerBattlesWon: 0,
      monCaught: 0,
      team: [],
      ready: false,
      playerSocket: socket,
      sprite: overWorldSprites[randSprite],
    });
    overWorldSprites.splice(randSprite, 1);
    playersInLobby.push(id);
    io.emit("player-joined", playersInLobby);
    console.log(id + " joined the lobby");
  }

  //lobby rules updates
  socket.on("send-rules-update", (starter, journey, area) => {
    console.log("Starter Rule - " + starter);
    console.log("Wild Area Rule - " + area);

    if (starter == "Random Fair") {
      console.log("generating mon");
      const keys = Object.keys(monList);
      for (let i = 0; i < 3; i++) {
        let rand = Math.floor(Math.random() * keys.length);
        if (monList[keys[rand]].moves && monList[keys[rand]].moves.length) {
          if (!starters.includes(keys[rand])) starters.push(keys[rand]);
          else i--;
        } else {
          i--;
        }
      }
      console.log(starters);
    }

    starterRule = starter;
    wildAreaRule = area;
    const rules = { starter: starter, journey: journey, area: area };
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
        if (monList[keys[rand]].moves && monList[keys[rand]].moves.length) {
          if (!genStarters.includes(keys[rand])) genStarters.push(keys[rand]);
          else i--;
        } else {
          i--;
        }
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

  //A player requests the wild area choices
  socket.on("get-wild-areas", () => {
    var wildAreaOptions = [];
    var comeback = false;
    var lowest = 0;

    for (let i = 0; i < lobby.players.length; i++) {
      if (lobby.players[i].score < lobby.players[lowest].score) lowest = i;
    }

    if (id == lobby.players[lowest].name) {
      comeback = true;
      console.log(id + "is in comeback");
    }

    if (lobby.round % 2 != 0)
      wildAreaOptions = genWildAreas(lobby.round, comeback);
    else wildAreaOptions = genTrainerBattles();

    console.log("sending wild areas to " + id);
    console.log(wildAreaOptions);
    io.to(id).emit("wild-area-options", wildAreaOptions);
  });

  //A player starts a battle with a npc trainer
  socket.on("start-wild-battle", async (id, opponent, oppTeam) => {
    const used = process.memoryUsage();
    for (let key in used) {
      console.log(
        `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
      );
    }

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

    //the team of the player
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

  //a player has a score update
  socket.on("update-score", (id, score) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].score += score;
        console.log(id + "score increase by " + score);
      }
    }

    lobbyUpdate();
  });

  //a player spends a candy
  socket.on("spend-candy", (id, amount) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].candiesSpent += amount;
      }
    }
    lobbyUpdate();
    console.log(id + " spend " + amount);
  });

  //a player has caught a mon
  socket.on("caught-a-mon", (id, amount) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].monCaught += amount;
        lobby.players[i].score += 1;
      }
    }
    lobbyUpdate();
  });

  socket.on("won-a-npc-battle", (id, amount) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].npcBattlesWon += amount;
        lobby.players[i].score += 1;
      }
    }
    lobbyUpdate();
  });

  socket.on("won-a-player-battle", (id, amount) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].playerBattlesWon += amount;
        lobby.players[i].score += 1;
      }
    }
    lobbyUpdate();
  });

  socket.on("mon-knocked-out", (id, amount) => {
    for (let i = 0; i < lobby.players.length; i++) {
      if (id == lobby.players[i].name.replace(/['"]+/g, "")) {
        lobby.players[i].score += amount;
      }
    }
    console.log(id + " koed " + amount);
    lobbyUpdate();
  });
});

const startTrainerBattle = async () => {
  if (lobby.round === 6 || lobby.round === 12 || lobby.round === 18) {
    let players = [];

    for (let i = 0; i < playersInLobby.length; i++) {
      let rand = Math.floor(Math.random() * playersInLobby.length);
      if (!players.includes(rand)) players.push(rand);
      else i--;
    }

    console.log(players);

    let battleCount = 0;
    let playerCount = 1;

    while (battleCount < playersInLobby.length / 2) {
      battle[battleCount] = new Battle(
        io,
        playersInLobby[players[playerCount - 1]],
        playersInLobby[players[playerCount]],
        lobby.players[players[playerCount - 1]].playerSocket,
        lobby.players[players[playerCount]].playerSocket,
        lobby.players[players[playerCount - 1]].team,
        lobby.players[players[playerCount]].team,
        endBattle,
        battleCount
      );
      console.log("---Starting Battle---");
      const res = await battle[battleCount].startBattle();
      battleStart = true;
      //console.log("in run");
      battle[battleCount].runBattle();
      battleCount++;
      playerCount += 2;
    }
  }
};

const lobbyUpdate = () => {
  sendLobby.round = lobby.round;
  sendLobby.newRound = lobby.newRound;

  lobby.players.map((player, index) => {
    sendLobby.players[index] = {
      name: player.name,
      score: player.score,
      monCaught: player.monCaught,
      candiesSpent: player.candiesSpent,
      npcBattlesWon: player.npcBattlesWon,
      playerBattlesWon: player.playerBattlesWon,
      ready: player.ready,
      sprite: player.sprite,
    };
  });

  console.log("sending a lobby update");
  io.emit("lobby-update", sendLobby);
};

const checkForNewRound = () => {
  if (lobby.round == 18 && readyToStart == lobby.players.length && gameStart) {
    endGame();
  }
  //update players with lobby info - Beginning of Round
  else if (readyToStart == lobby.players.length && gameStart) {
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

const genWildAreas = (round, comeback) => {
  var choices = [];
  for (let i = 0; i < 3; i++) {
    let rand = Math.floor(Math.random() * 100);
    let area = wildArea(round, rand, comeback);
    if (!choices.includes(area)) choices.push(area);
    else i--;
  }
  return choices;
};

const genTrainerBattles = () => {
  var choices = [];
  for (let i = 0; i < 2; i++) {
    let trainerRand = Math.floor(Math.random() * 100);
    const trainer = trainerBattles(trainerRand);
    choices.push(trainer);
  }
  return choices;
};

const wildArea = (round, num, comeback) => {
  var area = "";

  switch (wildAreaRule) {
    case "Classic":
      if (round <= 6) {
        area = l1Areas(num);
      } else if (round > 6 && round <= 12) {
        area = l2Areas(num, comeback);
      } else if (round >= 13) {
        area = l3Areas(num, comeback);
      }
      break;
    case "Random":
      let rand = Math.floor(Math.random() * 3);
      switch (rand) {
        case 0:
          area = l1Areas(num);
          break;
        case 1:
          area = l2Areas(num);
          break;
        case 2:
          area = l3Areas(num);
          break;
      }
      break;
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

const l2Areas = (num, comeback) => {
  if (comeback) num += 15;
  if (num < 19) return "Slowpoke Well|Common";
  if (19 <= num && num < 37) return "Ilex Forest|Common";
  if (37 <= num && num < 55) return "Digletts Cave|Common";
  if (55 <= num && num < 70) return "Rock Tunnel|Uncommon";
  if (70 <= num && num < 85) return "National Park|Uncommon";
  if (85 <= num && num < 90) return "Safari Zone|Rare";
  if (90 <= num && num < 95) return "Ice Path|Rare";
  if (95 <= num && num < 99) return "Power Plant|Epic";
  if (num >= 99) return "Rocket Hideout|Legendary";

  console.log(num);
  return "error";
};

const l3Areas = (num, comeback) => {
  if (comeback) num += 15;
  if (num < 13) return "Pokemon Mansion|Common";
  if (13 <= num && num < 26) return "Mt.Ember|Common";
  if (26 <= num && num < 40) return "Whirl Islands|Common";
  if (40 <= num && num < 57) return "Victory Road|Uncommon";
  if (57 <= num && num < 75) return "Forest Route|Uncommon";
  if (75 <= num && num < 90) return "Cerulean Cave|Rare";
  if (90 <= num && num < 99) return "Mt.Silver|Epic";
  if (num >= 99) return "Dragons Den|Legendary";

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

const endBattle = (index) => {
  console.log("ending the battle");
  battleStart = false;
  readyToBattle = 0;

  if (lobby.round < 18) {
    //start trade
    trades[index] = new Trade(
      io,
      battle[index].socket1,
      battle[index].socket2,
      index,
      endTrade
    );
    trades[index].startTrade();
  }

  battle[index] = null;

  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
};

const endWildBattle = (index) => {
  console.log("ending the battle");
  wildBattles[index] = null;

  const used = process.memoryUsage();
  for (let key in used) {
    console.log(
      `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
};

const endTrade = (index) => {
  console.log("ending the trade");
  trades[index] = null;
};

const endGame = () => {
  sendLobby.round = lobby.round;
  sendLobby.newRound = lobby.newRound;

  lobby.players.map((player, index) => {
    sendLobby.players[index] = {
      name: player.name,
      score: player.score,
      monCaught: player.monCaught,
      candiesSpent: player.candiesSpent,
      npcBattlesWon: player.npcBattlesWon,
      playerBattlesWon: player.playerBattlesWon,
      ready: player.ready,
    };
  });

  io.emit("game-finish", sendLobby);
};

httpServer.listen(3001, setup.ip);
