import { Box, Typography, Grid, Tooltip } from "@mui/material";
import React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import CookieIcon from "@mui/icons-material/Cookie";

const PlayerInfo = ({ id, money, balls, candies }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "5px",
        border: "solid",
        borderWidth: "3px",
        borderColor: "gray",
        backgroundColor: "#f8f8f8",
        boxShadow: "0px 3px gray",
      }}
    >
      <Grid container textAlign={"center"} spacing={1}>
        <Grid item xs={3}>
          <Typography>{id}</Typography>
        </Grid>
        <Grid item container xs={3}>
          <Tooltip title="Money">
            <AttachMoneyIcon />
          </Tooltip>
          : {money}
        </Grid>
        <Grid item container xs={3}>
          <Tooltip title="Pokeballs">
            <CatchingPokemonIcon />
          </Tooltip>{" "}
          : {balls}
        </Grid>
        <Grid item container xs={3}>
          <Tooltip title="Candies">
            <CookieIcon />
          </Tooltip>{" "}
          :{candies}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerInfo;
