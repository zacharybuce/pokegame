import { Box, Typography } from "@mui/material";
import React from "react";
import Item from "./Item";

const ItemBag = ({ items, team, setTeam, setItems, setMoney }) => {
  return (
    <Box textAlign={"center"} sx={{ mt: "2vh" }}>
      <Typography>Items</Typography>
      <Box
        sx={{
          mt: "1vh",
          p: 1,
          borderRadius: "5px",
          border: "solid",
          borderWidth: "1px",
          minHeight: "15vh",
          maxHeight: "15vh",
          overflowY: "scroll",
        }}
      >
        {items.map((item, index) => {
          return (
            <Item
              name={item}
              team={team}
              items={items}
              setTeam={setTeam}
              setItems={setItems}
              setMoney={setMoney}
              key={index}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default ItemBag;
