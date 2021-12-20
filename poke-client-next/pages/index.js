import * as React from "react";
import { SocketProvider } from "../contexts/SocketProvider";
import useLocalStorage from "../hooks/useLocalStorage";
import { styled } from "@mui/material/styles";
import Login from "../components/Login";
import Board from "../components/Board";

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

export default function Index() {
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
