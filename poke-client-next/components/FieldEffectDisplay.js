import React from "react";
import FilterNoneIcon from "@mui/icons-material/FilterNone";
import FilterNoneTwoToneIcon from "@mui/icons-material/FilterNoneTwoTone";
import PushPinIcon from "@mui/icons-material/PushPin";
import { Grid, Tooltip } from "@mui/material";

export const FieldEffectDisplay = ({ fieldEffects }) => {
  const display = (effect) => {
    switch (effect) {
      case "Reflect":
        return (
          <Tooltip title="Reflect">
            <FilterNoneIcon />
          </Tooltip>
        );
      case "move: Light Screen":
        return (
          <Tooltip title="Light Screen">
            <FilterNoneTwoToneIcon />
          </Tooltip>
        );
      case "move: Toxic Spikes":
        return (
          <Tooltip title="Toxic Spikes">
            <PushPinIcon
              sx={{ transform: "rotate(180deg)", color: "#A33EA1" }}
            />
          </Tooltip>
        );
      case "Spikes":
        return (
          <Tooltip title="Spikes">
            <PushPinIcon
              sx={{ transform: "rotate(180deg)", color: "#E2BF65" }}
            />
          </Tooltip>
        );
      case "move: Stealth Rock":
        return (
          <Tooltip title="Stealth Rock">
            <PushPinIcon
              sx={{ transform: "rotate(180deg)", color: "#B6A136" }}
            />
          </Tooltip>
        );
    }
  };

  return (
    <Grid container direction="row">
      {fieldEffects.map((effect) => display(effect))}
    </Grid>
  );
};
