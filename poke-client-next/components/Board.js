import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { BattleOptions } from "./BattleOptions";
import { BattleDisplay } from "./BattleDisplay";
import { Button, Dialog, Typography, Divider, Box } from "@mui/material";

const Board = ({ id, handleClose, setMoney, setCandies }) => {
  const socket = useSocket();
  const [player1, setPlayer1] = useState();
  const [team, setTeam] = useState();
  const [field, setField] = useState();
  const [battleEnd, setBattleEnd] = useState(false);
  const [winner, setWinner] = useState(null);
  const [candyReward, setCandyReward] = useState(0);

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

    return () => socket.off("side-update");
  }, [socket, team]);

  /*----------UPDATE----------*/
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("update", (fieldUpdate) => setField(fieldUpdate));
    console.log(field);
    return () => socket.off("update");
  }, [socket, field]);

  const sendMoveChoice = (moveIndex) => {
    console.log("sending choice...");
    socket.emit("send-move", moveIndex, id);
  };

  const sendSwitchChoice = (pokeid) => {
    socket.emit("send-switch", pokeid, id);
  };

  const setRewards = (money, candies, winner) => {
    const len = JSON.parse(team).side.pokemon.length;
    setCandyReward(candies * len);
    setWinner(winner);
    setMoney((prevState) => prevState + money);
    setCandies((prevState) => prevState + candies * len);
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
        />
      ) : (
        <div></div>
      )}

      {team ? (
        <BattleOptions
          team={team}
          sendMoveChoice={sendMoveChoice}
          sendSwitchChoice={sendSwitchChoice}
        />
      ) : (
        <div></div>
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
            <Typography variant="h6">Money: {winner ? "1000" : "0"}</Typography>
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
