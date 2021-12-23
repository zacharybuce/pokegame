import { Grid, Alert } from "@mui/material";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import ItemBag from "./GameBoardComponents/ItemBag";
import PlayerInfo from "./GameBoardComponents/PlayerInfo";
import Shop from "./GameBoardComponents/Shop";
import RoundDisplay from "./GameBoardComponents/RoundDisplay";
import { useSocket } from "../contexts/SocketProvider";
import PlayerDisplay from "./GameBoardComponents/PlayerDisplay";
import EndTurn from "./GameBoardComponents/EndTurn";
import StartTurn from "./GameBoardComponents/StartTurn";
const PokeDisplay = dynamic(import("./GameBoardComponents/PokeDisplay"));

const GameBoard = ({ id }) => {
  const socket = useSocket();
  const [money, setMoney] = useState(3000);
  const [balls, setBalls] = useState(5);
  const [items, setBag] = useState([]);
  const [team, setTeam] = useState([]);
  const [box, setBox] = useState([]);
  const [lobby, setLobby] = useState();
  const [ready, setReady] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

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

    socket.on("lobby-update", (lobby) => setLobby(lobby));

    return () => socket.off("lobby-update");
  }, [socket, lobby]);

  const endTurn = () => {
    socket.emit("round-finish", id);
    setReady(true);
  };

  return (
    <Grid container>
      <Grid item container xs={10} spacing={1}>
        <Grid item xs={12}>
          <RoundDisplay activeStep={activeStep} />
        </Grid>
        <Grid item xs={12} sx={{ mt: "1vh" }}>
          <PlayerInfo id={id} money={money} balls={balls} />
        </Grid>
        <Grid item xs={10}>
          {winReady ? (
            <PokeDisplay
              team={team}
              setTeam={setTeam}
              box={box}
              setBox={setBox}
            />
          ) : (
            <div></div>
          )}
        </Grid>
        <Grid item xs={2}>
          <ItemBag items={items} />
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={4}>
            <Shop
              money={money}
              setMoney={setMoney}
              setBalls={setBalls}
              setBag={setBag}
            />
          </Grid>
          {!ready ? (
            <Grid item container sx={{ justifyContent: "flex-end" }} xs={8}>
              <Grid item xs={6} sx={{ mr: "1vw" }}>
                <StartTurn />
              </Grid>
              <EndTurn endTurn={endTurn} />
            </Grid>
          ) : (
            <Alert severity="info">Waiting for other players...</Alert>
          )}
        </Grid>
      </Grid>
      <Grid item xs={2}>
        {lobby ? <PlayerDisplay lobby={lobby} /> : <div></div>}
      </Grid>
    </Grid>
  );
};

export default GameBoard;
