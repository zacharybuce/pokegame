import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
} from "@mui/material";
import WildArea from "./WildArea";
import { useSocket } from "../../contexts/SocketProvider";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

const WildBattle = ({ id, balls, setBalls, setBox, handleClose }) => {
  const [wildAreas, setWildAreas] = useState(null);
  const [areaChoice, setAreaChoice] = useState(null);
  const [wildMon, setWildMon] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    socket.emit("get-wild-areas", id);
    setAreaChoice(null);
  }, []);

  useEffect(() => {
    if (areaChoice !== null) getWildMon();
  }, [areaChoice]);

  useEffect(() => {
    console.log("in useEffect");
    if (socket === undefined) return;

    socket.on("wild-area-options", (options) => {
      setWildAreas(options);
      console.log(options);
    });

    return () => socket.off("wild-area-options");
  }, [socket]);

  const chooseArea = (name) => {
    setAreaChoice(name);
    setWildMon("Pikachu");
  };

  const getWildMon = async () => {
    const res = await fetch("http://localhost:3000/api/wildMon/" + areaChoice);
    const data = await res.json();
    const pokeRes = await fetch(
      "http://localhost:3000/api/genmon/" + data.data
    );
    const pokeData = await pokeRes.json();
    console.log(pokeData.data);
    setWildMon(pokeData.data);
  };

  const throwBall = async () => {
    const res = await fetch("http://localhost:3000/api/catch", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(wildMon),
    });

    const data = await res.json();

    setBalls((prevState) => prevState - 1);

    if (data.data) {
      console.log("caught");
      setBox((prevState) => [...prevState, wildMon]);
      handleClose();
    }
  };

  if (!areaChoice)
    return (
      <Box sx={{ backgroundColor: "#fafafa" }}>
        <DialogTitle>Choose a Wild Area to go to</DialogTitle>
        <DialogContent>
          <Grid container spacing={1} sx={{ textAlign: "center" }}>
            {wildAreas ? (
              wildAreas.map((wildArea) => {
                return <WildArea name={wildArea} chooseArea={chooseArea} />;
              })
            ) : (
              <div></div>
            )}
          </Grid>
        </DialogContent>
      </Box>
    );

  if (wildMon.species)
    return (
      <Grid container sx={{ p: 1 }} spacing={1}>
        <Grid item xs={12} sx={{ textAlign: "center", mb: "10vh" }}>
          <Typography variant="h4">
            A Wild {wildMon.species} Appeared!
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", mb: "2vh" }}>
          <Typography variant="h6">
            {wildMon.species} Lvl {wildMon.level}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", mb: "10vh" }}>
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/ani/" +
              wildMon.species.toLowerCase() +
              ".gif"
            }
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => throwBall()}
            fullWidth
            variant="contained"
            disabled={balls == 0 ? true : false}
          >
            Throw Ball{" "}
            <Box sx={{ alignItems: "center", display: "flex", ml: "2vw" }}>
              <CatchingPokemonIcon /> : {balls}
            </Box>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => handleClose()}
            fullWidth
            variant="contained"
            color="error"
          >
            Run
          </Button>
        </Grid>
      </Grid>
    );

  return <div></div>;
};

export default WildBattle;
