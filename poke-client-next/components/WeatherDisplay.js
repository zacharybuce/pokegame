import React from "react";
import { Box, Tooltip } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WavesIcon from "@mui/icons-material/Waves";
import CloudIcon from "@mui/icons-material/Cloud";
import FlareIcon from "@mui/icons-material/Flare";
import AcUnitIcon from "@mui/icons-material/AcUnit";
const display = (weather) => {
  switch (weather) {
    case "none":
      return (
        <Tooltip title="No Weather">
          <WbSunnyIcon />
        </Tooltip>
      );
    case "Sandstorm":
      return (
        <Tooltip title="Sandstorm">
          <WavesIcon sx={{ color: "#E2BF65" }} />
        </Tooltip>
      );
    case "RainDance":
      return (
        <Tooltip title="Rain">
          <CloudIcon sx={{ color: "#6390F0" }} />
        </Tooltip>
      );
    case "SunnyDay":
      return (
        <Tooltip title="Sunny Day">
          <FlareIcon sx={{ color: "#EE8130" }} />
        </Tooltip>
      );
    case "Hail":
      return (
        <Tooltip title="Hail">
          <AcUnitIcon sx={{ color: "#96D9D6" }} />
        </Tooltip>
      );
  }
};

export const WeatherDisplay = ({ weather }) => {
  return display(weather);
};
