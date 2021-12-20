import React, { useState, useEffect, useCallback } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { BattleOptions } from "./BattleOptions";
import { BattleDisplay } from "./BattleDisplay";

const Board = ({ id }) => {
  const socket = useSocket();
  const [player1, setPlayer1] = useState();
  const [team, setTeam] = useState();
  const [field, setField] = useState();

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
    socket.emit("send-move", moveIndex, id);
  };

  const sendSwitchChoice = (pokeid) => {
    socket.emit("send-switch", pokeid, id);
  };

  return (
    <div>
      {field ? <BattleDisplay field={field} player1={player1} /> : <div></div>}
      {team ? (
        <BattleOptions
          team={team}
          sendMoveChoice={sendMoveChoice}
          sendSwitchChoice={sendSwitchChoice}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Board;
