import { Box } from "@mui/material";
import React from "react";
import PlayerDisplayCard from "./PlayerDisplayCard";

const PlayerDisplay = ({ lobby }) => {
  return (
    <Box sx={{ ml: "7vw" }}>
      {lobby.players.map((player) => {
        return (
          <Box sx={{ mb: "1vh" }}>
            <PlayerDisplayCard player={player} />
          </Box>
        );
      })}
    </Box>
  );
};

export default PlayerDisplay;
