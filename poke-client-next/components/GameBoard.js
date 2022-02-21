import { Grid, Alert, Button, Slider, Stack, Box } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import ItemBag from "./GameBoardComponents/ItemBag";
import PlayerInfo from "./GameBoardComponents/PlayerInfo";
import Shop from "./GameBoardComponents/Shop";
import RoundDisplay from "./GameBoardComponents/RoundDisplay";
import { useSocket } from "../contexts/SocketProvider";
import PlayerDisplay from "./GameBoardComponents/PlayerDisplay";
import StartTurn from "./GameBoardComponents/StartTurn";
import RoundDialog from "./GameBoardComponents/RoundDialog";
import GameFinishDialog from "./GameBoardComponents/GameFinishDialog";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Sound from "react-sound";
const PokeDisplay = dynamic(import("./GameBoardComponents/PokeDisplay"));
import { styled } from "@mui/material/styles";
import NextRoundDialog from "./GameBoardComponents/NextRoundDialog";
import TradeDialog from "./GameBoardComponents/TradeDialog";

const RoundContainer = styled("div")(({ theme }) => ({
  marginRight: "7vw",
  marginLeft: "7vw",
  marginBottom: "5vh",
  paddingTop: "10vh",
  [theme.breakpoints.up("xl")]: {
    marginRight: "20vw",
    marginLeft: "20vw",
  },
}));

const AppContainer = styled("div")(({ theme }) => ({
  marginRight: "7vw",
  marginLeft: "7vw",
  // marginBottom: "7vh",
  // paddingTop: "1vh",
  [theme.breakpoints.up("xl")]: {
    marginRight: "24vw",
    marginLeft: "24vw",
  },
  [theme.breakpoints.down("md")]: {
    marginRight: "2vw",
    marginLeft: "2vw",
  },
}));

const GameBoard = ({ id }) => {
  const mockLobby = {
    round: 1,
    players: [
      { name: "zach", score: 0 },
      { name: "notzach", score: 0 },
    ],
  };

  const socket = useSocket();
  const [money, setMoney] = useState(3000);
  const [balls, setBalls] = useState(5);
  const [candies, setCandies] = useState(0);
  const [items, setBag] = useState([]);
  const [team, setTeam] = useState([]);
  const [box, setBox] = useState([]);
  const [lobby, setLobby] = useState();
  const [ready, setReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0); //round number
  const [roundOpen, setRoundOpen] = useState(false); //state for round Dialog
  const [roundType, setRoundType] = useState();
  const [roundDone, setRoundDone] = useState(false); //if round action has been completed
  const [shopItems, setShopItems] = useState([]);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [results, setResults] = useState();
  const [volume, setVolume] = React.useState(30);
  const [song, setSong] = useState("");
  const [songStatus, setSongStatus] = useState(Sound.status.PLAYING);
  const [battleMusic, setBattleMusic] = useState(false);
  const [newRoundDialog, setNewRoundDialog] = useState(false);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [tradeInfo, setTradeInfo] = useState([]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleSongFinishedPlaying = () => {
    let newSong = "";
    let findSong = true;
    while (findSong) {
      let rand = Math.floor(Math.random() * 11);
      switch (rand) {
        case 0:
          newSong = "AzaleaTown";
          break;
        case 1:
          newSong = "Epilogue";
          break;
        case 2:
          newSong = "GoldenrodCity";
          break;
        case 3:
          newSong = "NationalPark";
          break;
        case 4:
          newSong = "NewBarkTown";
          break;
        case 5:
          newSong = "Route29";
          break;
        case 6:
          newSong = "VioletCity";
          break;
        case 7:
          newSong = "CeruleanCity";
          break;
        case 8:
          newSong = "RedsJourney";
          break;
        case 9:
          newSong = "RoadToViridian";
          break;
        case 10:
          newSong = "ViridianCity";
          break;
      }
      if (newSong != song) findSong = false;
    }
    setSong(newSong);
  };

  //for song
  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  //render mon correctly for drag
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
    handleSongFinishedPlaying();
  }, []);

  //Lobby Update
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("lobby-update", (inLobby) => {
      setLobby(inLobby);

      setActiveStep(inLobby.round);

      if (inLobby.newRound) {
        setRoundDone(false);
        setReady(false);
        getNewShop();
        setNewRoundDialog(true);
      }
    });
    console.log("lobby update");
    console.log(lobby);
    return () => socket.off("lobby-update");
  }, [socket, lobby]);

  //check for trades
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("start-trade", (player1, player2) => {
      setTradeDialogOpen(true);
      let isP1 = false;

      if (player1.replace(/['"]+/g, "") == id) {
        console.log("you are p1");
        isP1 = true;
      } else {
        console.log("you are p2");
        isP1 = false;
      }

      setTradeInfo([player1, player2, isP1]);
    });

    return () => socket.off("start-trade");
  }, [socket, lobby]);

  //game finish
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("game-finish", (inLobby) => {
      setLobby(inLobby);
      setResults(inLobby);
      setFinishDialogOpen(true);
    });

    return () => socket.off("game-finish");
  }, [socket, lobby]);

  //send team update
  useEffect(() => {
    var newTeam = JSON.parse(JSON.stringify(team));

    for (let i = 0; i < team.length; i++) {
      if (team[i].item) {
        newTeam[i].item = team[i].item.split("|")[0];
      }
    }

    socket.emit("update-team", id, newTeam);
  }, [team]);

  useEffect(() => {
    if (!lobby) return;

    if (roundParse() == "trainer" && roundDone) {
      socket.emit("ready-to-trade", id);
    }
  }, [roundDone]);

  const endTurn = () => {
    if (roundDone) {
      setSongStatus(Sound.status.PLAYING);
      socket.emit("round-finish", id);
      setReady(true);
    }
  };

  const startTurn = () => {
    const turn = roundParse();
    switch (turn) {
      case "starter":
        setRoundOpen(true);
        setRoundType("starter");
        break;
      case "trainer":
        setRoundOpen(true);
        setRoundType("trainer");
        setSongStatus(Sound.status.PAUSED);
        socket.emit("trainer-battle-start", id);
        break;
      case "wild":
        setRoundOpen(true);
        setRoundType("wild");
        break;
    }
  };

  const roundParse = () => {
    if (lobby.round == 0) {
      return "starter";
    }
    if (lobby.round === 6 || lobby.round === 12 || lobby.round === 18) {
      return "trainer";
    }
    return "wild";
  };

  const getNewShop = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/getshop");
    const json = await res.json();

    console.log(json.data);
    setShopItems(json.data);
  };

  const reroll = () => {
    setMoney((prev) => prev - 500);
    getNewShop();
  };

  return (
    <Box sx={{ overflow: "hidden" }}>
      <RoundContainer>
        <Box
          sx={{
            backgroundColor: "#e9ebec",
            borderRadius: 3,
            p: 3,
            boxShadow: 5,
          }}
        >
          <RoundDisplay activeStep={activeStep} />
        </Box>
      </RoundContainer>
      <AppContainer>
        <Grid container sx={{}}>
          <Grid
            item
            container
            xs={10}
            spacing={1}
            sx={{
              backgroundColor: "#e9ebec",
              borderRadius: 3,
              p: 3,
              boxShadow: 5,
            }}
          >
            <Grid item xs={12} sx={{ mt: "1vh" }}>
              <PlayerInfo
                id={id}
                money={money}
                balls={balls}
                candies={candies}
              />
            </Grid>
            <Grid item xs={10}>
              {winReady ? (
                <PokeDisplay
                  team={team}
                  setTeam={setTeam}
                  box={box}
                  setBox={setBox}
                  candies={candies}
                  setCandies={setCandies}
                  setBag={setBag}
                  setMoney={setMoney}
                  id={id}
                />
              ) : (
                <div></div>
              )}
            </Grid>
            <Grid item xs={2}>
              <ItemBag
                items={items}
                team={team}
                setTeam={setTeam}
                setItems={setBag}
                setMoney={setMoney}
              />
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={4}>
                <Shop
                  money={money}
                  setMoney={setMoney}
                  setBalls={setBalls}
                  setBag={setBag}
                  shopItems={shopItems}
                  balls={balls}
                  reroll={reroll}
                />
              </Grid>
              {!ready ? (
                <Grid item container sx={{ justifyContent: "flex-end" }} xs={8}>
                  <Grid item xs={6} sx={{ mr: "1vw" }}>
                    {!roundDone ? (
                      <StartTurn startTurn={startTurn} />
                    ) : (
                      <div></div>
                    )}
                  </Grid>
                  <Button
                    onClick={() => endTurn()}
                    color="error"
                    variant="contained"
                    disabled={!roundDone}
                  >
                    {activeStep == 18 && roundDone
                      ? "View Results"
                      : "End Turn"}
                  </Button>
                </Grid>
              ) : (
                <Alert severity="info">Waiting for other players...</Alert>
              )}
            </Grid>
          </Grid>
          <Grid item xs={2}>
            {lobby ? <PlayerDisplay lobby={lobby} /> : <div></div>}
          </Grid>
          {results ? (
            <GameFinishDialog
              finishDialogOpen={finishDialogOpen}
              setFinishDialogOpen={setFinishDialogOpen}
              lobby={results}
            />
          ) : (
            <div></div>
          )}

          <RoundDialog
            roundOpen={roundOpen}
            setRoundOpen={setRoundOpen}
            round={roundType}
            setTeam={setTeam}
            setBox={setBox}
            setRoundDone={setRoundDone}
            setMoney={setMoney}
            setBalls={setBalls}
            setCandies={setCandies}
            balls={balls}
            activeStep={activeStep}
            id={id}
            team={team}
            setBattleMusic={setBattleMusic}
            candies={candies}
            setBag={setBag}
          />
        </Grid>
        <Sound
          url={"/music/" + song + ".mp3"}
          playStatus={songStatus}
          autoLoad={true}
          volume={volume}
          onFinishedPlaying={handleSongFinishedPlaying}
        />
        <Stack
          spacing={2}
          direction="row"
          sx={{
            backgroundColor: "#fafafa",
            position: "fixed",
            width: "15vw",
            height: "5vh",
            top: "90%",
            left: "80%",
            mb: 1,
            borderRadius: "3px",
            border: "solid",
            borderWidth: "1px",
            borderColor: "gray",
            p: 1,
            boxShadow: 5,
          }}
          alignItems="center"
        >
          <VolumeDown />
          <Slider aria-label="Volume" value={volume} onChange={handleChange} />
          <VolumeUp />
        </Stack>
        {battleMusic ? (
          <Sound
            url={"/music/BattleJohto.mp3"}
            playStatus={Sound.status.PLAYING}
            autoLoad={true}
            volume={volume}
            loop={true}
          />
        ) : (
          <div></div>
        )}
        <NextRoundDialog
          round={activeStep}
          open={newRoundDialog}
          setOpen={setNewRoundDialog}
        />
        {tradeInfo.length ? (
          <TradeDialog
            p1={tradeInfo[0]}
            p2={tradeInfo[1]}
            isP1={tradeInfo[2]}
            id={id}
            dialogOpen={tradeDialogOpen}
            setDialogOpen={setTradeDialogOpen}
            team={team}
            box={box}
            setTeam={setTeam}
            setBox={setBox}
            setTradeInfo={setTradeInfo}
          />
        ) : (
          <div></div>
        )}
      </AppContainer>
    </Box>
  );
};

export default GameBoard;
