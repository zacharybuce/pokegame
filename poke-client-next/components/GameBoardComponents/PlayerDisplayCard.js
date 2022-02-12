import { Box, Tooltip } from "@mui/material";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const PlayerDisplayCard = ({ player }) => {
  return (
    <Box sx={{ width: "220px" }}>
      <Box
        component="span"
        className={player.ready ? "uncommon" : ""}
        sx={{
          textAlign: "end",
          backgroundColor: "#152238",
          color: "black",
          display: "inline-block",
          position: "relative",
          width: "100px",
          left: "8px",
          top: "2px",
        }}
      >
        <Box
          component="span"
          sx={{
            pl: 1,
            pr: 1,
            color: "white",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {player.name.replace(/['"]+/g, "")}
        </Box>
      </Box>

      <Box
        component="span"
        sx={{
          backgroundColor: "#152238",
          borderRadius: 1,
          textAlign: "center",
          color: "white",
          display: "inline-block",
          position: "relative",
          left: "8px",
          top: "4px",
          fontSize: "20px",
          width: "30px",
        }}
      >
        {player.score}
      </Box>

      <Box
        component="span"
        sx={{
          width: "64px",
          height: "64px",
          display: "inline-block",
          alignItems: "center",
        }}
      >
        <img
          className="playerIcon"
          src={"/OverWorld/" + player.sprite + ".png"}
        ></img>
      </Box>

      <Box
        component="span"
        sx={{
          position: "relative",
          right: "210px",
          top: "9px",
        }}
      >
        {player.ready ? (
          <Tooltip title="Ready">
            <CheckCircleOutlineIcon />
          </Tooltip>
        ) : (
          <Tooltip title="Not Ready...">
            <HourglassEmptyIcon />
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default PlayerDisplayCard;
