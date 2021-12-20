import React, { useEffect, useState } from "react";
import { Grid, Button, Typography } from "@mui/material";
import PokeIcon from "./PokeIcon";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 420,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

const SwitchButton = ({ poke, sendSwitchChoice }) => {
  const toolTipTitle = (
    <React.Fragment>
      <Typography>{poke.details}</Typography>
      <Typography>{poke.condition}</Typography>
      <Typography>
        <b>Item:</b> {poke.item}
      </Typography>
      <Typography>
        <b>Ability:</b> {poke.ability}
      </Typography>
      <Typography>
        <b>Moves:</b>
      </Typography>
      <Typography>
        {poke.moves[0]} {poke.moves[1]}
      </Typography>
      <Typography>
        {poke.moves[2]} {poke.moves[3]}
      </Typography>
    </React.Fragment>
  );

  return (
    <Grid item xs={2}>
      <HtmlTooltip title={toolTipTitle}>
        <Button
          onClick={() => {
            const name = poke.details
              .split(",")[0]
              .toLowerCase()
              .replace(/\s/g, "");
            sendSwitchChoice(name);
          }}
        >
          <PokeIcon name={poke.details.split(",")[0]} />
        </Button>
      </HtmlTooltip>
    </Grid>
  );
};

export default SwitchButton;
