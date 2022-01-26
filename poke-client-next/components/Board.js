import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { BattleOptions } from "./BattleOptions";
import { BattleDisplay } from "./BattleDisplay";
import {
  Button,
  Dialog,
  Typography,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";

const Board = ({ id, handleClose, setMoney, setCandies, rarity }) => {
  const socket = useSocket();
  const [player1, setPlayer1] = useState();
  const [team, setTeam] = useState();
  const [field, setField] = useState();
  const [battleEnd, setBattleEnd] = useState(false);
  const [winner, setWinner] = useState(null);
  const [candyReward, setCandyReward] = useState(0);
  const [moneyReward, setMoneyReward] = useState(0);
  const [hasSelected, setHasSelected] = useState();
  const [animsDone, setAnimsDone] = useState(true);

  const fieldUpdate = () => {
    if (socket === undefined) return;

    socket.on("update", (fieldUpdate) => setField(fieldUpdate));
    console.log(field);
    return () => socket.off("update");
  };

  const sideUpdate = () => {
    if (socket === undefined) return;

    socket.on("side-update", (team, player1) => {
      setTeam(team);
      setPlayer1(player1);
    });

    return () => socket.off("side-update");
  };

  if (!field) {
    fieldUpdate();
  }

  if (!team) {
    sideUpdate();
  }

  /*------SIDEUPDATE----------*/
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("side-update", (team, player1) => {
      setTeam(team);
      setPlayer1(player1);
    });
    setHasSelected(false);
    return () => socket.off("side-update");
  }, [socket, team]);

  /*----------UPDATE----------*/
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("update", (fieldUpdate) => setField(fieldUpdate));
    console.log(field);
    setHasSelected(false);
    return () => socket.off("update");
  }, [socket, field]);

  const sendMoveChoice = (moveIndex) => {
    console.log("sending choice...");
    socket.emit("send-move", moveIndex, id);
    setHasSelected(true);
  };

  const sendSwitchChoice = (pokeid) => {
    socket.emit("send-switch", pokeid, id);
    setHasSelected(true);
  };

  const setRewards = (money, candies, winner) => {
    if (rarity == "player") {
      const len = JSON.parse(team).side.pokemon.length;
      setCandyReward(candies * len);
      setMoneyReward(money);
      setMoney((prevState) => prevState + money);
      setCandies((prevState) => prevState + candies * len);
    } else if (winner) {
      let battleCandies = 0;
      let battleMoney = 0;
      switch (rarity) {
        case "Common":
          battleCandies = 2;
          battleMoney = 500;
          break;
        case "Uncommon":
          battleCandies = 2;
          battleMoney = 850;
          break;
        case "Rare":
          battleCandies = 2;
          battleMoney = 1000;
          break;
        case "Epic":
          battleCandies = 3;
          battleMoney = 1000;
          break;
        case "Legendary":
          battleCandies = 4;
          battleMoney = 1000;
          break;
      }

      setMoney((prevState) => prevState + battleMoney);
      setCandies((prevState) => prevState + battleCandies);
      setCandyReward(battleCandies);
      setMoneyReward(battleMoney);
    } else {
      setCandyReward(1);
      setMoneyReward(0);
      setMoney((prevState) => prevState + 0);
      setCandies((prevState) => prevState + 1);
    }

    setWinner(winner);
  };

  return (
    <div>
      {field ? (
        <BattleDisplay
          field={field}
          team={team}
          player1={player1}
          id={id}
          setBattleEnd={setBattleEnd}
          setRewards={setRewards}
          setAnimsDone={setAnimsDone}
        />
      ) : (
        <Box sx={{ textAlign: "center", mt: "10vh", mb: "10vh" }}>
          <Typography sx={{ mb: "1vh" }}>
            Waiting for the Opponent...
          </Typography>
          <CircularProgress />
        </Box>
      )}

      {team ? (
        <BattleOptions
          team={team}
          sendMoveChoice={sendMoveChoice}
          sendSwitchChoice={sendSwitchChoice}
          animsDone={animsDone}
          hasSelected={hasSelected}
        />
      ) : (
        <div>
          {team ? (
            <Box sx={{ minHeight: "22vh", textAlign: "center" }}>
              <Typography sx={{ mt: "10vh", mb: "1vh" }}>
                Waiting for the Opponent...
              </Typography>
              <CircularProgress />
            </Box>
          ) : (
            <div></div>
          )}
        </div>
      )}
      <Dialog maxWidth={"sm"} open={battleEnd}>
        <Box sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h2">
            You {winner ? "Won the Battle!" : "Lost..."}
          </Typography>
          <Divider />
          <Box sx={{ textAlign: "center", mb: "5vh" }}>
            <Typography variant="h4" sx={{ mt: "2vh", mb: "2vh" }}>
              Rewards
            </Typography>
            <Typography variant="h6">Money: {moneyReward}</Typography>
            <Typography variant="h6">Candies: {candyReward}</Typography>
          </Box>
          <Button variant="contained" onClick={() => handleClose()}>
            Close Battle
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default Board;
