import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

const ShopItem = ({ name, setBoughtItem, money, setMoney }) => {
  const [itemData, setItemData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getPos = () => {
    const w = 385;
    const h = 1152;

    const num = itemData.spritenum;

    const y = Math.floor(num / 16) * 24 * -1;
    const x = (num % 16) * 24 * -1;

    return x + "px " + y + "px";
  };

  const getItemData = async () => {
    const bRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/items/" + name.split("|")[0]
    );
    const itemData = await bRes.json();
    setItemData(itemData.data);
  };

  const getCost = (rarity) => {
    switch (rarity) {
      case "Common":
        return 450;
        break;
      case "Uncommon":
        return 750;
        break;
      case "Rare":
        return 1200;
        break;
      case "Epic":
        return 1800;
        break;
      case "Legendary":
        return 2500;
        break;
    }
  };

  const buyItem = (item) => {
    const rarity = name.split("|")[1];
    var cost = getCost(rarity);

    if (money >= cost) {
      console.log("bought " + item);
      setBoughtItem(name);
      setMoney(money - cost);
    } else {
      enqueueSnackbar(`Not enough Money...`, {
        variant: "error",
      });
    }
  };

  const getAnim = (rarity) => {
    switch (rarity) {
      case "Common":
        return "common";
      case "Uncommon":
        return "uncommon";
      case "Rare":
        return "rare";
      case "Epic":
        return "epic";
      case "Legendary":
        return "legendary";
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
          className={getAnim(name.split("|")[1])}
          sx={{
            zIndex: "1",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <CardActionArea onClick={() => buyItem(name)} sx={{ height: "100%" }}>
            <CardContent>
              {itemData ? (
                <Grid alignItems="center" justifyContent="center" container>
                  <Box
                    sx={{
                      width: "24px",
                      height: "24px",
                      backgroundImage: "url(/itemicons-sheet.png)",
                      backgroundPosition: getPos(),
                      mb: "2vh",
                    }}
                  ></Box>
                </Grid>
              ) : (
                <div></div>
              )}
              <Typography>{name.split("|")[0]}</Typography>
              <Typography sx={{ mt: "2vh", fontSize: 12 }}>
                {itemData ? itemData.desc : "loading..."}
              </Typography>
              <Typography sx={{ mt: "2vh" }}>
                Cost: {itemData ? getCost(name.split("|")[1]) : "loading..."}
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
