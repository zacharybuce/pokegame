import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { useSocket } from "../contexts/SocketProvider";

const Lobby = ({ id, setGameStart }) => {
  const socket = useSocket();
  const [lobby, setLobby] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (socket === undefined) return;

    console.log(lobby);
    socket.on("player-joined", (players) => setLobby(players));
    return () => socket.off("player-joined");
  }, [socket, lobby]);

  useEffect(() => {
    if (socket === undefined) return;

    socket.on("start-game", (start) => setGameStart(start));
    return () => socket.off("start-game");
  }, [socket]);

  const readyUp = () => {
    socket.emit("send-ready");
    setReady(true);
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h1" sx={{ mb: "5vh" }}>
        Game Lobby
      </Typography>
      <Typography variant="h3">Players: </Typography>
      {lobby ? (
        lobby.map((player, index) => {
          return (
            <Typography>
              player {index + 1} : {player}
            </Typography>
          );
        })
      ) : (
        <div></div>
      )}

      <Box sx={{ mt: "3vh" }}>
        {!ready ? (
          <Button onClick={() => readyUp()} variant="contained">
            Ready
          </Button>
        ) : (
          <Alert severity="success">Ready! Waiting for other players...</Alert>
        )}
      </Box>
    </Box>
  );
};

export default Lobby;
