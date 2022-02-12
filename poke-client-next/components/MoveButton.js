import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const typeColor = (type) => {
  switch (type) {
    case "Normal":
      return "#A8A77A";
    case "Fire":
      return "#EE8130";
    case "Water":
      return "#6390F0";
    case "Electric":
      return "#F7D02C";
    case "Grass":
      return "#7AC74C";
    case "Ice":
      return "#96D9D6";
    case "Fighting":
      return "#C22E28";
    case "Poison":
      return "#A33EA1";
    case "Ground":
      return "#E2BF65";
    case "Flying":
      return "#A98FF3";
    case "Psychic":
      return "#F95587";
    case "Bug":
      return "#A6B91A";
    case "Rock":
      return "#B6A136";
    case "Ghost":
      return "#735797";
    case "Dragon":
      return "#6F35FC";
    case "Dark":
      return "#705746";
    case "Steel":
      return "#B7B7CE";
    case "Fairy":
      return "#D685AD";
  }
};

const MoveButton = ({ move, index, sendMoveChoice }) => {
  const [moveInfo, setMoveInfo] = useState(null);

  const getMoveInfo = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL +
        "/api/moves/" +
        move.move.toLowerCase().replace(/\s/g, "")
    );
    const data = await res.json();
    setMoveInfo(data.data);
  };

  useEffect(() => {
    getMoveInfo();
  }, [move]);

  const toolTipContent = () => {
    const tooltip = (
      <React.Fragment>
        <Typography>
          <b>Type:</b> {JSON.stringify(moveInfo.type)}
        </Typography>
        <Typography>
          <b>Accuracy:</b> {JSON.stringify(moveInfo.accuracy)}
        </Typography>
        <Typography>
          <b>Base Power:</b> {JSON.stringify(moveInfo.basePower)}
        </Typography>
        <Typography>
          <b>Desc:</b> {JSON.stringify(moveInfo.shortDesc)}
        </Typography>
        <Typography>
          <b>Category: </b>
          {JSON.stringify(moveInfo.category)}
        </Typography>
      </React.Fragment>
    );

    return tooltip;
  };

  const toolTipLoading = (
    <React.Fragment>
      <Typography>loading...</Typography>
    </React.Fragment>
  );

  return (
    <Grid item xs={6}>
      <HtmlTooltip title={moveInfo ? toolTipContent() : toolTipLoading}>
        <Button
          onClick={() => sendMoveChoice(index + 1)}
          id={index}
          fullWidth
          variant="contained"
          sx={{ backgroundColor: moveInfo ? typeColor(moveInfo.type) : "" }}
        >
          {move.move} {move.pp}/{move.maxpp}
        </Button>
      </HtmlTooltip>
    </Grid>
  );
};

export default MoveButton;
