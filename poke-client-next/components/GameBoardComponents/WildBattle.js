import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  DialogContent,
  DialogTitle,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import WildArea from "./WildArea";
import { useSocket } from "../../contexts/SocketProvider";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { useSnackbar } from "notistack";
import Board from "../Board";
const WildBattle = ({
  id,
  balls,
  setBalls,
  setCandies,
  setMoney,
  setBox,
  handleClose,
  round,
}) => {
  const [wildAreas, setWildAreas] = useState(null);
  const [areaChoice, setAreaChoice] = useState(null);
  const [wildMon, setWildMon] = useState("mon");
  const [trainerBattle, setTrainerBattle] = useState(false);
  const [oppTeam, setOppTeam] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const socket = useSocket();
  const fakeOpp = [
    {
      name: "",
      species: "Squirtle",
      gender: "",
      item: "",
      level: "20",
      ability: "Torrent",
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 4, spe: 0 },
      nature: "Modest",
      ivs: { hp: 31, atk: 31, def: 31, spa: 30, spd: 30, spe: 31 },
      moves: ["Tackle", "Water Pulse", "Withdraw", "Bite"],
    },
  ];

  useEffect(() => {
    socket.emit("get-wild-areas", id);
    setAreaChoice(null);
  }, []);

  useEffect(async () => {
    if (areaChoice !== null) {
      if (!areaChoice.startsWith("Trainer")) getWildMon();
      else {
        if (round >= 5) {
          const evs = genEvs();
          let newTeam = oppTeam;
          newTeam[0].evs = evs;
          setOppTeam(newTeam);
        }
        socket.emit("start-wild-battle", id, "Opponent", oppTeam);
        setTrainerBattle(true);
      }
    }
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

  const chooseArea = async (name, isTrainer, mon) => {
    if (!isTrainer && mon !== undefined) {
      setAreaChoice(name);
      setWildMon("mon");
    } else if (mon !== undefined) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_ROOT_URL + "/api/genmon/" + mon
      );
      const json = await res.json();

      setOppTeam([json.data]);
      setAreaChoice(name);
    }
  };

  const fightMon = () => {
    enqueueSnackbar(
      `The wild ${wildMon.species} was defeated! Gain ${
        ((wildMon.level - 20) / 5 + 1) * 2
      } candies`,
      {
        variant: "success",
      }
    );
    setCandies((prevState) => prevState + ((wildMon.level - 20) / 5 + 1) * 2);
    handleClose();
  };

  const getWildMon = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/wildMon/" + areaChoice
    );
    const data = await res.json();
    const pokeRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/genmon/" + data.data
    );
    const pokeData = await pokeRes.json();
    var mon = pokeData.data;
    console.log(pokeData.data);

    if (round >= 5) {
      const evs = genEvs();
      mon.evs = evs;
    }
    setWildMon(mon);
  };

  const throwBall = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_ROOT_URL + "/api/catch", {
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
      enqueueSnackbar(`The wild ${wildMon.species} was caught!`, {
        variant: "success",
      });
      setCandies((prevState) => prevState + ((wildMon.level - 20) / 5 + 1));
      handleClose();
    } else {
      enqueueSnackbar(`The wild ${wildMon.species} was not caught...`, {
        variant: "error",
      });
    }
  };

  const genEvs = () => {
    var evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    var keys = Object.keys(evs);
    var picked = [];

    for (let i = 0; i < 3; i++) {
      let ev = Math.floor(Math.random() * 6);
      if (!picked.includes(ev)) {
        picked.push(ev);
        evs[keys[ev]] = 28;
      } else i--;
    }

    return evs;
  };

  if (!areaChoice)
    return (
      <Box sx={{ backgroundColor: "#fafafa" }}>
        <DialogTitle>Choose a Wild Area to go to</DialogTitle>
        <DialogContent>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ textAlign: "center" }}
          >
            {wildAreas ? (
              wildAreas.map((wildArea) => {
                return (
                  <WildArea
                    name={wildArea}
                    chooseArea={chooseArea}
                    round={round}
                  />
                );
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
              wildMon.species.replace("-", "").toLowerCase() +
              ".gif"
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Balls in your bag" placement="top-start">
            <Box sx={{ alignItems: "center", display: "flex", ml: "2vw" }}>
              <CatchingPokemonIcon /> : {balls}
            </Box>
          </Tooltip>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => throwBall()}
            fullWidth
            variant="contained"
            disabled={balls == 0 ? true : false}
          >
            Throw Ball{" "}
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
        <Grid item xs={12}>
          <Button
            onClick={() => fightMon()}
            fullWidth
            variant="contained"
            color="warning"
          >
            Fight
          </Button>
        </Grid>
      </Grid>
    );

  if (trainerBattle)
    return (
      <Box sx={{ p: 3 }}>
        <Board
          id={id}
          handleClose={handleClose}
          setMoney={setMoney}
          setCandies={setCandies}
          rarity={areaChoice.split("|")[1]}
        />
      </Box>
    );

  return <div></div>;
};

export default WildBattle;
