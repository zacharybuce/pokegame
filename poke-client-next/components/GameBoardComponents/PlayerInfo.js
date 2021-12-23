import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";

const PlayerInfo = ({ id, money, balls }) => {
  return (
    <Box
      sx={{ p: 2, borderRadius: "5px", border: "solid", borderWidth: "1px" }}
    >
      <Grid container textAlign={"center"} spacing={1}>
        <Grid item xs={4}>
          <Typography>{id}</Typography>
        </Grid>
        <Grid item container xs={4}>
          <AttachMoneyIcon />: {money}
        </Grid>
        <Grid item container xs={4}>
          <CatchingPokemonIcon /> : {balls}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlayerInfo;
