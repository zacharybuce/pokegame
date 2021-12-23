import { Box, Typography } from "@mui/material";
import React from "react";
import Item from "./Item";

const ItemBag = ({ items }) => {
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
        }}
      >
        {items.map((item) => {
          return <Item name={item} />;
        })}
      </Box>
    </Box>
  );
};

export default ItemBag;
