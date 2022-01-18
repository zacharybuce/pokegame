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
        >
          {move.move} {move.pp}/{move.maxpp}
        </Button>
      </HtmlTooltip>
    </Grid>
  );
};

export default MoveButton;
