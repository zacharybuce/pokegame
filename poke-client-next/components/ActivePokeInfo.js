import React, { useState, useEffect } from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import useWindowDimensions from "../hooks/useWindowDimensions";

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

const ActivePokeInfo = ({ team }) => {
  const [pokeData, setPokeData] = useState(null);
  const { height, width } = useWindowDimensions();

  const getActiveMon = async () => {
    const poke = team.side.pokemon[0];
    const pokeName = poke.details.split(",")[0];
    const ability = poke.ability;
    const item = poke.item ? poke.item : "none";
    const itemData = "";

    const aRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/abilities/" + ability
    );
    const abilityData = await aRes.json();

    if (item != "none") {
      const bRes = await fetch(
        process.env.NEXT_PUBLIC_ROOT_URL + "/api/items/" + item
      );
      itemData = await bRes.json();
    }

    const data = {
      name: pokeName,
      ability: ability,
      item: item,
      abilityData: abilityData.data.desc,
      itemData: item == "none" ? "none" : itemData.data.desc,
      stats: poke.stats,
    };
    setPokeData(data);
  };

  useEffect(() => {
    getActiveMon();
  }, [team]);

  if (pokeData) {
    const ability = (
      <HtmlTooltip
        title={
          <React.Fragment>
            <div>{pokeData.abilityData}</div>
          </React.Fragment>
        }
      >
        <span>{pokeData.ability}</span>
      </HtmlTooltip>
    );

    const item = (
      <HtmlTooltip
        title={
          <React.Fragment>
            <div>{pokeData.itemData}</div>
          </React.Fragment>
        }
      >
        <span>{pokeData.item}</span>
      </HtmlTooltip>
    );
    return (
      <Grid container item spacing={1}>
        <Grid item xs={6}>
          <Typography sx={{ mb: "1vh" }}>
            <b>Ability:</b> {ability}
          </Typography>
          <Typography>
            <b>Item:</b> {item}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container>
            {Object.keys(pokeData.stats).map(function (key, index) {
              return (
                <Grid item xs={6}>
                  <Typography sx={{ fontSize: width < 900 ? "13px" : "1rem" }}>
                    <b>{key}</b> : {pokeData.stats[key]}
                  </Typography>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box sx={{ textAlign: "center" }}>
      <CircularProgress />
    </Box>
  );
};

export default ActivePokeInfo;
