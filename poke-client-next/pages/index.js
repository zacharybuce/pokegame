import React, { useState } from "react";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import { styled } from "@mui/material/styles";
import Login from "../components/Login";
import Board from "../components/Board";
import Lobby from "../components/Lobby";
import GameBoard from "../components/GameBoard";
import { Box } from "@mui/material";
import App from "../components/App";

const AppContainer = styled("div")(({ theme }) => ({
  // marginRight: "7vw",
  // marginLeft: "7vw",
  // marginBottom: "7vh",
  // [theme.breakpoints.up("xl")]: {
  //   marginRight: "24vw",
  //   marginLeft: "24vw",
  // },
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
        <Box
          sx={{
            height: "100vh",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              opacity: 0.4,
              backgroundImage: "url(/Backgrounds/GoldenrodBackground.gif)",
              backgroundSize: "cover",
              filter: "brightness(50%)",
              zIndex: -1,
              backgroundRepeat: "no-repeat",
            },
          }}
        >
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
