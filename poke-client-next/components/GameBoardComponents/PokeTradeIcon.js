import { Button, Tooltip, Typography } from "@mui/material";
import React from "react";
import PokeIcon from "../PokeIcon";
import { tooltipClasses } from "@mui/material/Tooltip";
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

const PokeTradeIcon = ({ poke, tradeOffer }) => {
  const toolTipTitle = (
    <React.Fragment>
      <Typography>
        <b>{poke.species}</b>
      </Typography>
      <Typography>
        <b>{poke.level}</b>
      </Typography>
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
    <HtmlTooltip title={toolTipTitle}>
      <Button
        variant="outlined"
        color="pokeicon"
        onClick={() => tradeOffer(poke)}
      >
        <PokeIcon name={poke.species} shiny={poke.shiny} />
      </Button>
    </HtmlTooltip>
  );
};

export default PokeTradeIcon;
