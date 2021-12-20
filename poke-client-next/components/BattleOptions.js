import React, { useEffect } from "react";
import { Grid, Typography, Tooltip, Alert, Box } from "@mui/material";
import MoveButton from "./MoveButton";
import SwitchButton from "./SwitchButton";

export const BattleOptions = ({ team, sendMoveChoice, sendSwitchChoice }) => {
  console.log(team);

  if (JSON.parse(team).wait)
    return (
      <Box sx={{ mt: "5vh" }}>
        <Alert severity="info">Waiting for the opponenet...</Alert>
      </Box>
    );

  return (
    <Grid container spacing={2} sx={{ mt: "2vh" }}>
      {!JSON.parse(team).forceSwitch ? (
        JSON.parse(team).active[0].moves.map((move, index) => {
          return (
            <MoveButton
              move={move}
              index={index}
              sendMoveChoice={sendMoveChoice}
            />
          );
        })
      ) : (
        <Grid item xs={12} sx={{ textAlign: "center", alignContent: "center" }}>
          <Alert severity="error">Choose a Pokemon to switch to</Alert>
        </Grid>
      )}

      <Grid item xs={12}>
        <Typography>Switch:</Typography>
      </Grid>

      {team ? (
        JSON.parse(team).side.pokemon.map((poke) => {
          if (!poke.active && poke.condition != "0 fnt")
            return (
              <SwitchButton poke={poke} sendSwitchChoice={sendSwitchChoice} />
            );
        })
      ) : (
        <div></div>
      )}
    </Grid>
  );
};
