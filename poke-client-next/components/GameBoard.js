import { Grid, Alert, Button } from "@mui/material";
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
const PokeDisplay = dynamic(import("./GameBoardComponents/PokeDisplay"));

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
  const [candies, setCandies] = useState(20);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  //render mon correctly for drag
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
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
      }
    });
    console.log("lobby update");
    console.log(lobby);
    return () => socket.off("lobby-update");
  }, [socket, lobby]);

  useEffect(() => {
    var newTeam = JSON.parse(JSON.stringify(team));

    for (let i = 0; i < team.length; i++) {
      if (team[i].item) {
        newTeam[i].item = team[i].item.split("|")[0];
      }
    }

    socket.emit("update-team", id, newTeam);
  }, [team]);

  const endTurn = () => {
    if (roundDone) {
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
    if (lobby.round === 4 || lobby.round === 8 || lobby.round === 12) {
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

  return (
    <Grid container sx={{ mt: "10vh" }}>
      <Grid item container xs={10} spacing={1}>
        <Grid item xs={12}>
          <RoundDisplay activeStep={activeStep} />
        </Grid>
        <Grid item xs={12} sx={{ mt: "1vh" }}>
          <PlayerInfo id={id} money={money} balls={balls} candies={candies} />
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
            />
          </Grid>
          {!ready ? (
            <Grid item container sx={{ justifyContent: "flex-end" }} xs={8}>
              <Grid item xs={6} sx={{ mr: "1vw" }}>
                {!roundDone ? <StartTurn startTurn={startTurn} /> : <div></div>}
              </Grid>
              <Button
                onClick={() => endTurn()}
                color="error"
                variant="contained"
                disabled={!roundDone}
              >
                End Turn
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
      />
    </Grid>
  );
};

export default GameBoard;
