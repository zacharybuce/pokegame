import React from "react";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import Login from "./Login";
import { styled } from "@mui/material/styles";
import Board from "./Board";

const AppContainer = styled("div")(({ theme }) => ({
  marginTop: "30vh",
  marginRight: "10vw",
  marginLeft: "10vw",
  marginBottom: "7vh",
  [theme.breakpoints.up("xl")]: {
    marginRight: "20vw",
    marginLeft: "20vw",
  },
}));

function App() {
  const [id, setId] = useLocalStorage("id");

  const dashboard = (
    <SocketProvider id={id}>
      <div>id : {id}</div>
      <Board id={id} />
    </SocketProvider>
  );

  return (
    <AppContainer>{id ? dashboard : <Login setId={setId} />}</AppContainer>
  );
}

export default App;
