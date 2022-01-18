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
import PokeIcon from "../PokeIcon";
import PokeInfo from "./PokeInfo";
import PokeStats from "./PokeStats";
import StarIcon from "@mui/icons-material/Star";
import EditMovesDialog from "./EditMovesDialog";

const PokemonPiece = ({ poke, candies, setCandies, team, setTeam, setBag }) => {
  const [open, setOpen] = useState(false);
  const [canEvolve, setCanEvolve] = useState(false);
  const [editing, setEditing] = useState(false);

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
  };

  const increaseEVs = (evs) => {
    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(poke)
    );
    var newMon = poke;
    newMon.evs = evs;

    setTeam([...filteredTeam, newMon]);
  };

  const stars = () => {
    if (poke.level - 20 == 0) return <StarIcon />;
    if (poke.level - 20 == 5)
      return (
        <span>
          <StarIcon />
          <StarIcon />
        </span>
      );
    if (poke.level - 20 == 10)
      return (
        <span>
          <StarIcon />
          <StarIcon />
          <StarIcon />
        </span>
      );
  };

  const checkCanEvolve = () => {
    var candiesUsed = 0;
    Object.keys(poke.evs).forEach((key) => {
      let n = poke.evs[key] / 28;
      candiesUsed += (n / 2) * (1 + n);
    });
    if (candiesUsed >= poke.evolveCandies) setCanEvolve(true);
    console.log(candiesUsed);
  };

  const handleEvolve = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/evolve/" + poke.species
    );
    const data = await res.json();
    const evo = data.data;

    var mon = poke;
    mon.species = evo.species;
    mon.level = poke.level + 5;
    mon.evolveCandies = evo.evolveCandies;
    mon.newMoves = evo.newMoves;
    mon.types = evo.types;
    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(poke)
    );
    setTeam([...filteredTeam, mon]);
    handleClose();
  };

  //submit for move changes
  const handleSubmit = (moves, newMoves) => {
    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(poke)
    );

    var newMon = poke;
    newMon.moves = moves;
    newMon.newMoves = newMoves;
    setTeam([...filteredTeam, newMon]);
    setEditing(false);
  };

  const takeItem = () => {
    setBag((prevState) => [...prevState, poke.item]);
    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(poke)
    );
    var newMon = poke;
    newMon.item = "";
    setTeam([...filteredTeam, newMon]);
  };

  useEffect(() => {
    checkCanEvolve();
  }, [team]);

  if (poke)
    return (
      <Box sx={{ mr: "5px", ml: "5px" }}>
        <Box sx={{ height: "6px", backgroundColor: "lightgray" }}></Box>
        <Button
          onClick={() => handleClickOpen()}
          sx={{ backgroundColor: "white" }}
        >
          {poke ? <PokeIcon name={poke.species} /> : <div></div>}
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={open}
          onClose={handleClose}
        >
          <Box sx={{ backgroundColor: "#fafafa" }}>
            <DialogTitle>
              {poke.species} Lvl: {poke.level} {stars()}{" "}
              <Tooltip title={"Candies to Evolve: " + poke.evolveCandies}>
                <span>
                  <Button
                    onClick={() => handleEvolve()}
                    variant="contained"
                    color="success"
                    disabled={!canEvolve}
                  >
                    Evolve
                  </Button>
                </span>
              </Tooltip>
            </DialogTitle>
            <DialogContent>
              <Grid container>
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
                  />
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
