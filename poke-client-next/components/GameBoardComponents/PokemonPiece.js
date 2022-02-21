import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSocket } from "../../contexts/SocketProvider";
import PokeIcon from "../PokeIcon";
import PokeInfo from "./PokeInfo";
import PokeStats from "./PokeStats";
import StarIcon from "@mui/icons-material/Star";
import CookieIcon from "@mui/icons-material/Cookie";
import EditMovesDialog from "./EditMovesDialog";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const PokemonPiece = ({
  poke,
  candies,
  setCandies,
  team,
  setTeam,
  setBag,
  setMoney,
  id,
  inBox,
}) => {
  const socket = useSocket();
  const [open, setOpen] = useState(false);
  const [canEvolve, setCanEvolve] = useState(false);
  const [editing, setEditing] = useState(false);
  const [candiesUsed, setCandiesUsed] = useState(0);

  const handleClickOpen = () => {
    console.log(poke);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatIncrease = (stat) => {
    var evs = poke.evs;
    var cost = 0;
    switch (stat) {
      case "hp":
        evs.hp = evs.hp + 28;
        cost = evs.hp / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
      case "atk":
        evs.atk = evs.atk + 28;
        cost = evs.atk / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
      case "def":
        evs.def = evs.def + 28;
        cost = evs.def / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
      case "spa":
        evs.spa = evs.spa + 28;
        cost = evs.spa / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
      case "spd":
        evs.spd = evs.spd + 28;
        cost = evs.spd / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
      case "spe":
        evs.spe = evs.spe + 28;
        cost = evs.spe / 28;
        increaseEVs(evs);
        setCandies((prevState) => prevState - cost);
        break;
    }
    socket.emit("spend-candy", id, cost);
  };

  const increaseEVs = (evs) => {
    var filteredTeam = team;
    var newMon = poke;

    filteredTeam.forEach((mem, index) => {
      if (JSON.stringify(mem) == JSON.stringify(poke)) {
        newMon.evs = evs;
        filteredTeam[index] = newMon;
      }
    });

    setTeam([...filteredTeam]);
  };

  const stars = () => {
    if (poke.shiny) return <StarIcon />;
  };

  const checkCanEvolve = () => {
    var candiesUsed = 0;
    Object.keys(poke.evs).forEach((key) => {
      let n = poke.evs[key] / 28;
      candiesUsed += (n / 2) * (1 + n);
    });
    if (candiesUsed >= poke.evolveCandies) {
      console.log("candies used: " + candiesUsed);
      console.log("evolve candies " + poke.evolveCandies);
      setCanEvolve(true);
    } else {
      setCanEvolve(false);
    }
    if (poke.evolveCandies == "MAX") setCanEvolve(false);
    setCandiesUsed(candiesUsed);
  };

  const handleEvolve = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/evolve/" + poke.species
    );
    const data = await res.json();
    const evo = data.data;

    var mon = poke;
    if (!mon.newMoves) mon.newMoves = [];
    mon.species = evo.species;
    mon.level = poke.level + evo.levelUp;
    mon.evolveCandies = evo.evolveCandies;
    mon.newMoves = mon.newMoves.concat(evo.newMoves);
    if (evo.types) mon.types = evo.types;
    if (evo.ability) mon.ability = evo.ability;

    var filteredTeam = team;

    filteredTeam.forEach((mem, index) => {
      if (JSON.stringify(mem) == JSON.stringify(poke)) {
        filteredTeam[index] = mon;
      }
    });

    setTeam([...filteredTeam]);

    handleClose();
  };

  //submit for move changes
  const handleSubmit = (moves, newMoves) => {
    var filteredTeam = team;
    var newMon = poke;

    filteredTeam.forEach((mem, index) => {
      if (JSON.stringify(mem) == JSON.stringify(poke)) {
        newMon.moves = moves;
        newMon.newMoves = newMoves;
        filteredTeam[index] = newMon;
      }
    });

    setTeam([...filteredTeam]);
    setEditing(false);
  };

  const takeItem = () => {
    console.log("taking item: " + poke.item);
    setBag((prevState) => [...prevState, poke.item]);
    var filteredTeam = team;
    var newMon = poke;
    filteredTeam.forEach((mem, index) => {
      if (JSON.stringify(mem) == JSON.stringify(poke)) {
        newMon.item = "";
        filteredTeam[index] = newMon;
      }
    });

    setTeam([...filteredTeam]);
  };

  const releaseMon = (reward) => {
    if (reward == "candy") setCandies((prevState) => prevState + 1);
    if (reward == "money") setMoney((prevState) => prevState + 500);

    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(poke)
    );

    setTeam(filteredTeam);
    handleClose();
  };

  useEffect(() => {
    checkCanEvolve();
  }, [team]);

  if (poke)
    return (
      <Box sx={{}}>
        <Box sx={{ height: "6px", backgroundColor: "lightgray" }}></Box>
        <Button
          variant="outlined"
          color="pokeicon"
          onClick={() => handleClickOpen()}
          sx={{
            color: "white",
            backgroundColor: "rgb(154,159,161,.5)",
            p: 0,
          }}
        >
          {poke ? (
            <PokeIcon name={poke.species} shiny={poke.shiny} />
          ) : (
            <div></div>
          )}
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={open}
          onClose={handleClose}
        >
          <Box sx={{ backgroundColor: "#fafafa" }}>
            <DialogTitle
              sx={{
                backgroundColor: "#f0c870",
                border: "solid",
                borderWidth: "3px",
                borderColor: "gray",
                borderRadius: 1,
              }}
            >
              {poke.species}
              {stars()} Lvl: {poke.level + " "}
            </DialogTitle>
            <DialogContent sx={{ mt: "1vh" }}>
              <Grid container>
                <Grid item xs={12} sx={{ mb: "1.5vh", textAlign: "center" }}>
                  <Tooltip title={"Candies to Evolve: " + poke.evolveCandies}>
                    <span>
                      <Button
                        onClick={() => handleEvolve()}
                        variant="contained"
                        color="success"
                        disabled={!canEvolve}
                        fullWidth
                        sx={{ width: "75%" }}
                      >
                        Evolve
                      </Button>
                    </span>
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <PokeInfo
                    poke={poke}
                    setEditing={setEditing}
                    takeItem={takeItem}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: "1vh" }}>
                  <PokeStats
                    poke={poke}
                    statInc={handleStatIncrease}
                    candies={candies}
                    candiesUsed={candiesUsed}
                  />
                </Grid>
                <Grid item xs={2} sx={{ mt: "1vh" }}>
                  <Tooltip title="Release this Pokemon for 1 candy">
                    <Button
                      onClick={() => releaseMon("candy")}
                      disabled={team.length == 1 && !inBox}
                      variant="contained"
                      color="error"
                    >
                      Release <CookieIcon sx={{ ml: ".5vw" }} />
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid item xs={2} sx={{ mt: "1vh" }}>
                  <Tooltip title="Release this Pokemon for 500 Money">
                    <Button
                      onClick={() => releaseMon("money")}
                      disabled={team.length == 1 && !inBox}
                      variant="contained"
                      color="error"
                    >
                      Release
                      <AttachMoneyIcon sx={{ ml: ".5vw" }} />
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
              <EditMovesDialog
                editing={editing}
                setEditing={setEditing}
                poke={poke}
                handleSubmit={handleSubmit}
              />
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    );

  return <div></div>;
};

export default PokemonPiece;
