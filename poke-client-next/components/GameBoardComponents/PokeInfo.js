import { Grid, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import PokeInfoMove from "./PokeInfoMove";

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

const PokeInfo = ({ poke }) => {
  const [pokeData, setPokeData] = useState(null);

  const getMonInfo = async () => {
    const aRes = await fetch(
      "http://localhost:3000/api/abilities/" + poke.ability
    );
    const abilityData = await aRes.json();

    const data = {
      abilityData: abilityData.data.desc,
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
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>
            Type:{" "}
            {poke.types.map((type) => (
              <Box component="span" sx={{ color: typeColor(type) }}>
                {type}{" "}
              </Box>
            ))}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Item: {poke.item}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>Ability: {ability}</Typography>
        </Grid>
        <Grid item xs={12} sx={{ mt: "1vh" }}>
          <Typography variant="h6">Moves</Typography>
        </Grid>
        {poke.moves.map((move) => {
          return (
            <Grid item xs={6}>
              <PokeInfoMove move={move} />
            </Grid>
          );
        })}
      </Grid>
    );
  }
  return <div></div>;
};

export default PokeInfo;
