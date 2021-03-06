import { Grid, Typography, Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import PokeInfoMove from "./PokeInfoMove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const typeColor = (type) => {
  switch (type) {
    case "Normal":
      return "#A8A77A";
    case "Fire":
      return "#EE8130";
    case "Water":
      return "#6390F0";
    case "Electric":
      return "#F7D02C";
    case "Grass":
      return "#7AC74C";
    case "Ice":
      return "#96D9D6";
    case "Fighting":
      return "#C22E28";
    case "Poison":
      return "#A33EA1";
    case "Ground":
      return "#E2BF65";
    case "Flying":
      return "#A98FF3";
    case "Psychic":
      return "#F95587";
    case "Bug":
      return "#A6B91A";
    case "Rock":
      return "#B6A136";
    case "Ghost":
      return "#735797";
    case "Dragon":
      return "#6F35FC";
    case "Dark":
      return "#705746";
    case "Steel":
      return "#B7B7CE";
    case "Fairy":
      return "#D685AD";
  }
};

const PokeInfo = ({ poke, setEditing, takeItem }) => {
  const [pokeData, setPokeData] = useState(null);

  const getMonInfo = async () => {
    const aRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/abilities/" + poke.ability
    );
    const abilityData = await aRes.json();

    const nRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/natures/" + poke.nature
    );
    const natureData = await nRes.json();

    const data = {
      abilityData: abilityData.data.desc,
      natureData: natureData.data,
    };
    setPokeData(data);
  };

  useEffect(() => {
    getMonInfo();
  }, [poke]);

  if (poke && pokeData) {
    const ability = (
      <HtmlTooltip
        title={
          <React.Fragment>
            <div>{pokeData.abilityData}</div>
          </React.Fragment>
        }
      >
        <span>{poke.ability}</span>
      </HtmlTooltip>
    );

    if (poke && pokeData) {
      let plus;
      let minus;
      if (
        pokeData.natureData.plus != undefined &&
        pokeData.natureData.minus != undefined
      ) {
        plus = pokeData.natureData.plus;
        minus = pokeData.natureData.minus;
      } else {
        plus = "none";
        minus = "none";
      }
      const nature = (
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="green">
                {plus}
                <ArrowUpwardIcon />
              </Typography>
              <Typography color="error">
                {minus}
                <ArrowDownwardIcon />
              </Typography>
            </React.Fragment>
          }
        >
          <span>{poke.nature}</span>
        </HtmlTooltip>
      );
    }

    return (
      <Grid container spacing={1}>
        <Grid
          item
          container
          xs={12}
          sx={{ backgroundColor: "#d9d9d9", boxShadow: 2, borderRadius: 1 }}
        >
          <Grid item xs={12} md={3} sx={{ p: 1 }}>
            <Typography>
              Type:{" "}
              {poke.types.map((type) => (
                <Box component="span" sx={{ color: typeColor(type) }}>
                  {type}{" "}
                </Box>
              ))}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ p: 1 }}>
            <Typography>Nature: {nature}</Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ p: 1 }}>
            <Typography>
              Item: {poke.item.split("|")[0]}{" "}
              {poke.item ? (
                <Button onClick={() => takeItem()} color="error">
                  Take
                </Button>
              ) : (
                <div></div>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ p: 1 }}>
            <Typography>Ability: {ability}</Typography>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          spacing={1}
          sx={{ mt: "1vh", display: { xs: "none", md: "flex" } }}
        >
          <Grid item xs={12} sx={{ mb: "1vh" }}>
            <Box
              component="span"
              sx={{
                p: 1,
                backgroundColor: "#98c8e0",
                borderRadius: 1,
                border: "solid",
                borderLeftWidth: "0px",
                fontSize: "20px",
                boxShadow: 2,
                width: "100px",
                textAlign: "center",
                borderColor: "gray",
              }}
            >
              Moves
            </Box>
            <Button
              onClick={() => setEditing(true)}
              variant="contained"
              disabled={!poke.newMoves}
              sx={{ ml: "1vw" }}
            >
              Edit
            </Button>
          </Grid>
          {poke.moves.map((move) => {
            return (
              <Grid item xs={6}>
                <PokeInfoMove move={move} />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    );
  }
  return <div></div>;
};

export default PokeInfo;
