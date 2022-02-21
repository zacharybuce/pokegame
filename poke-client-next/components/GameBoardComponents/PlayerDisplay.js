import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import PlayerDisplayCard from "./PlayerDisplayCard";

const PlayerDisplay = ({ lobby }) => {
  const [sortedPlayer, setSortedPlayers] = useState([]);

  const playerSort = (a, b) => {
    if (a.score > b.score) return -1;
    else if (a.score < b.score) return 1;
    else return 0;
  };

  useEffect(() => {
    setSortedPlayers(lobby.players.sort(playerSort));
  }, [lobby]);

  return (
    <Box sx={{ ml: "1vw" }}>
      {sortedPlayer.map((player, index) => {
        return (
          <Box sx={{ mb: "1vh" }}>
            <PlayerDisplayCard
              player={player}
              underdog={index == sortedPlayer.length - 1}
              round={lobby.round}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default PlayerDisplay;
