import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const PlayerDisplay = ({ lobby }) => {
  return (
    <Grid container>
      {lobby.players.map((player) => {
        return (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", mb: "5vh" }}>
              <Typography>{player.name.replace(/['"]+/g, "")}</Typography>
              <Typography>{player.score}</Typography>
              {player.ready ? <CheckCircleOutlineIcon /> : "..."}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default PlayerDisplay;
