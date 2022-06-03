import { Box, Typography } from "@mui/material";
import React from "react";
import Item from "./Item";

const ItemBag = ({ items, team, setTeam, setItems, setMoney }) => {
  return (
    <Box>
      <Box
        textAlign={"center"}
        sx={{ mt: "2vh", display: { xs: "none", md: "block" } }}
      >
        <Box
          sx={{
            height: "58px",
            backgroundImage: "url(/BAG.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPositionY: "-5px",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "30px",
              textShadow: "2px 2px  #000000",
            }}
          >
            Items
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1,
            borderRadius: "3px",
            border: "solid",
            borderColor: "gray",
            borderWidth: "3px",
            minHeight: "15vh",
            maxHeight: "16vh",
            overflowY: "auto",
            backgroundColor: "#e0d857",
            boxShadow: "0px 5px gray",
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

      <Box
        textAlign={"center"}
        sx={{ mt: "2vh", display: { xs: "block", md: "none" } }}
      >
        <Box>
          <Typography>Items</Typography>
        </Box>
        <Box
          sx={{
            width: "50%",
            p: 1,
            borderRadius: "3px",
            border: "solid",
            borderColor: "gray",
            borderWidth: "3px",
            minHeight: "15vh",
            maxHeight: "16vh",
            overflowY: "auto",
            backgroundColor: "#e0d857",
            boxShadow: "0px 5px gray",
            m: "auto",
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
    </Box>
  );
};

export default ItemBag;
