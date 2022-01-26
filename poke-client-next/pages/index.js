import React, { useState } from "react";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import { styled } from "@mui/material/styles";
import Login from "../components/Login";
import Board from "../components/Board";
import Lobby from "../components/Lobby";
import GameBoard from "../components/GameBoard";
import { Box } from "@mui/material";

const AppContainer = styled("div")(({ theme }) => ({
  marginRight: "10vw",
  marginLeft: "10vw",
  marginBottom: "7vh",
  [theme.breakpoints.up("xl")]: {
    marginRight: "20vw",
    marginLeft: "20vw",
  },
}));

export default function Index() {
  const [id, setId] = useLocalStorage("id");
  const [gameStart, setGameStart] = useState(false);

  const dashboard = (
    <div>
      <div>id : {id}</div>
      <Board id={id} />
    </div>
  );

  const lobby = <Lobby id={id} setGameStart={setGameStart} />;

  const display = () => {
    if (!id) {
      return <Login setId={setId} />;
    } else if (id && !gameStart) {
      return lobby;
    } else {
      return (
        <Box sx={{ mt: "30vh" }}>
          <GameBoard id={id} />
        </Box>
      );
    }

    //return <GameBoard id={id} />;
  };

  return (
    <SocketProvider id={id}>
      <AppContainer>{display()}</AppContainer>
    </SocketProvider>
  );
}
