import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

const ShopItem = ({ name, setBoughtItem, money, setMoney }) => {
  const [itemData, setItemData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getItemData = async () => {
    const bRes = await fetch("http://localhost:3000/api/items/" + name);
    const itemData = await bRes.json();
    setItemData(itemData.data);
  };

  const buyItem = (item) => {
    if (money >= itemData.cost) {
      console.log("bought " + item);
      setBoughtItem(name);
      setMoney(money - itemData.cost);
    } else {
      enqueueSnackbar(`Not enough Money...`, {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    getItemData();
  }, [name]);

  if (name != "none")
    return (
      <Grid
        item
        xs
        sx={{
          m: 1,
          display: "flex",
        }}
      >
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <CardActionArea onClick={() => buyItem(name)} sx={{ height: "100%" }}>
            <CardContent>
              <img
                src={
                  "https://play.pokemonshowdown.com/sprites/itemicons/" +
                  name +
                  ".png"
                }
              />
              <Typography>{name}</Typography>
              <Typography sx={{ mt: "2vh", fontSize: 12 }}>
                {itemData ? itemData.desc : "loading..."}
              </Typography>
              <Typography sx={{ mt: "2vh" }}>
                Cost: {itemData ? itemData.cost : "loading..."}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );

  return (
    <Grid
      item
      xs
      sx={{
        m: 1,
        display: "flex",
      }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <CardContent>
          <Typography>Bought</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ShopItem;
