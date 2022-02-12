import React, { useEffect, useState } from "react";
import { Grid, Typography, Alert, Box, CircularProgress } from "@mui/material";
import MoveButton from "./MoveButton";
import SwitchButton from "./SwitchButton";
import ActivePokeInfo from "./ActivePokeInfo";

export const BattleOptions = ({
  team,
  sendMoveChoice,
  sendSwitchChoice,
  animsDone,
  hasSelected,
}) => {
  const [trapped, setTrapped] = useState(false);

  useEffect(() => {
    if (JSON.parse(team).active) setTrapped(JSON.parse(team).active[0].trapped);
    else setTrapped(false);
  }, [team]);
  //console.log(team);

  if (JSON.parse(team).wait)
    return (
      <Box sx={{ mt: "5vh" }}>
        <Alert severity="info">Waiting for the opponenet...</Alert>
      </Box>
    );

  if (!animsDone)
    return (
      <Grid
        container
        spacing={2}
        sx={{ mt: "2vh", minHeight: "30vh", maxHeight: "35vh", mb: "2vh" }}
      >
        <ActivePokeInfo team={JSON.parse(team)} />
      </Grid>
    );

  if (hasSelected)
    return (
      <Grid
        container
        sx={{ mt: "2vh", minHeight: "30vh", maxHeight: "35vh", mb: "2vh" }}
      >
        <ActivePokeInfo team={JSON.parse(team)} />
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Typography sx={{ mt: "1vh", mb: "1vh" }}>
            Waiting for the Opponent...
          </Typography>
          <CircularProgress />
        </Grid>
      </Grid>
    );

  return (
    <Grid
      container
      spacing={2}
      sx={{ mt: "2vh", minHeight: "30vh", maxHeight: "35vh", mb: "2vh" }}
    >
      <ActivePokeInfo team={JSON.parse(team)} />

      {!JSON.parse(team).forceSwitch ? (
        JSON.parse(team).active[0].moves.map((move, index) => {
          if (!move.disabled)
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
        <Grid item container xs={6}>
          {!trapped ? (
            JSON.parse(team).side.pokemon.map((poke, index) => {
              if (!poke.active && poke.condition != "0 fnt")
                return (
                  <Grid item xs={2}>
                    <SwitchButton
                      poke={poke}
                      sendSwitchChoice={sendSwitchChoice}
                      slot={index}
                    />
                  </Grid>
                );
            })
          ) : (
            <Box sx={{ ml: "5vw" }}>
              <Typography color="error">
                Cant Switch! The Active Pokemon is Trapped!
              </Typography>
            </Box>
          )}
        </Grid>
      ) : (
        <div></div>
      )}
    </Grid>
  );
};
