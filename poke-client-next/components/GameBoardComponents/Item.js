import React, { useState, useEffect } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

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

const Item = ({ name }) => {
  const [itemData, setItemData] = useState(null);

  const getItemData = async () => {
    const bRes = await fetch("http://localhost:3000/api/items/" + name);
    const itemData = await bRes.json();

    console.log(itemData);
    setItemData(itemData.data);
  };

  useEffect(() => {
    getItemData();
  }, [name]);

  if (itemData) {
    const tooltip = (
      <React.Fragment>
        <div>
          <b>{name}</b>
        </div>
        <div>{itemData.desc}</div>
      </React.Fragment>
    );
    return (
      <HtmlTooltip title={tooltip}>
        <Box>
          <img
            src={
              "https://play.pokemonshowdown.com/sprites/itemicons/" +
              name +
              ".png"
            }
          />
        </Box>
      </HtmlTooltip>
    );
  }

  return <div></div>;
};

export default Item;
