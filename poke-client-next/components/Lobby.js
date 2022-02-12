import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Grid,
  Divider,
  Slider,
  Stack,
} from "@mui/material";
import { useSocket } from "../contexts/SocketProvider";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";
import Sound from "react-sound";
import GameRulesDialog from "./GameRulesDialog";
import { styled } from "@mui/material/styles";

const AppContainer = styled("div")(({ theme }) => ({
  marginRight: "7vw",
  marginLeft: "7vw",
  marginBottom: "7vh",
  //paddingTop: "20vh",
  [theme.breakpoints.up("xl")]: {
    marginRight: "24vw",
    marginLeft: "24vw",
  },
}));

const Lobby = ({ id, setGameStart }) => {
  const socket = useSocket();
  const [lobby, setLobby] = useState();
  const [ready, setReady] = useState(false);
  const [journey, setJourney] = useState("Kanto-Johto");
  const [starter, setStarter] = useState("Classic");
  const [wildArea, setWildArea] = useState("Classic");
  const [readyPlayers, setReadyPlayers] = useState([]);
  const [open, setOpen] = useState(false);
  const [volume, setVolume] = React.useState(30);

  const handleChange = (event, newValue) => {
    setVolume(newValue);
  };

  //player joined
  useEffect(() => {
    if (socket === undefined) return;

    console.log(lobby);
    socket.on("player-joined", (players) => setLobby(players));
    return () => socket.off("player-joined");
  }, [socket, lobby]);

  //game start
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("start-game", (start) => setGameStart(start));
    return () => socket.off("start-game");
  }, [socket]);

  //rules changes
  useEffect(() => {
    if (socket === undefined) return;

    socket.on("lobby-rules-update", (rules) => {
      setStarter(rules.starter);
      setJourney(rules.journey);
      setWildArea(rules.area);
    });
    return () => socket.off("lobby-rules-update");
  }, [socket]);

  const readyUp = (id) => {
    socket.emit("send-ready");
    setReady(true);
    setReadyPlayers(readyPlayers.push(id));
  };

  if (lobby)
    return (
      <AppContainer>
        <Box sx={{ mt: "10vh" }}>
          <Typography variant="h1" sx={{ mb: "5vh", textAlign: "center" }}>
            PokéQuest
          </Typography>
          <Grid container sx={{ mb: "1vh" }}>
            <Grid item xs={6} sx={{ pr: "5vw" }}>
              <Typography variant="h6">Rules</Typography>
              <Divider></Divider>
              <Typography variant="h6">Starters: {starter}</Typography>
              <Typography variant="h6">Wild Areas: {wildArea}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">{journey}</Typography>
              <Box sx={{ justifyContent: "flex-end", display: "flex" }}>
                <Box
                  sx={{
                    borderRadius: "3px",
                    border: "solid",
                    borderWidth: "1px",
                    borderColor: "gray",
                    backgroundImage: "url(/kanto-johto.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "69px",
                    width: "100%",
                  }}
                ></Box>
              </Box>
            </Grid>
          </Grid>

          <Box
            sx={{
              borderRadius: "3px",
              border: "solid",
              borderWidth: "1px",
              borderColor: "gray",
              p: 1,
              boxShadow: 3,
              backgroundColor: "#edd479",
              minHeight: "30vh",
            }}
          >
            <Grid container>
              {lobby ? (
                lobby.map((player, index) => {
                  return (
                    <Grid item xs={6}>
                      <Box
                        sx={{
                          borderRadius: "3px",
                          border: "solid",
                          borderWidth: "1px",
                          borderColor: "gray",
                          p: 1,
                          m: "1vh",
                          backgroundColor: "#fafafa",
                        }}
                      >
                        <Typography variant="h4" sx={{ ml: "1vw" }}>
                          {player.replace(/['"]+/g, "")}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })
              ) : (
                <div></div>
              )}
            </Grid>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ mt: "3vh" }}>
                {!ready ? (
                  <Button
                    onClick={() => readyUp(id)}
                    variant="contained"
                    disabled={!lobby}
                    fullWidth
                  >
                    Ready
                  </Button>
                ) : (
                  <Alert severity="success">
                    Ready! Waiting for other players...
                  </Alert>
                )}
              </Box>
            </Grid>
            {id == lobby[0].replace(/['"]+/g, "") ? (
              <Grid item xs={6}>
                <Box sx={{ mt: "3vh" }}>
                  {!ready ? (
                    <Button
                      onClick={() => setOpen(true)}
                      variant="contained"
                      disabled={!lobby}
                      fullWidth
                      color="grey"
                    >
                      Game Settings
                    </Button>
                  ) : (
                    <div></div>
                  )}
                </Box>
              </Grid>
            ) : (
              <div></div>
            )}
          </Grid>
          <GameRulesDialog open={open} setOpen={setOpen} />
          <Sound
            url="/music/JourneyToJohto.mp3"
            playStatus={Sound.status.PLAYING}
            loop={true}
            autoLoad={true}
            volume={volume}
          />
          <Stack
            spacing={2}
            direction="row"
            sx={{
              position: "fixed",
              width: "15vw",
              height: "5vh",
              top: "90%",
              left: "80%",
              mb: 1,
              borderRadius: "3px",
              border: "solid",
              borderWidth: "1px",
              borderColor: "gray",
              p: 1,
              boxShadow: 5,
            }}
            alignItems="center"
          >
            <VolumeDown />
            <Slider
              aria-label="Volume"
              value={volume}
              onChange={handleChange}
            />
            <VolumeUp />
          </Stack>
        </Box>
      </AppContainer>
    );

  return (
    <Box sx={{ textAlign: "center", mt: "30vh" }}>
      <Typography variant="h3">Wait for server restart...</Typography>
    </Box>
  );
};

export default Lobby;
