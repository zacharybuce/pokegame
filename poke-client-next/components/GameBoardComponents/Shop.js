import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShopItem from "./ShopItem";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { useSnackbar } from "notistack";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const Shop = ({
  money,
  setMoney,
  setBalls,
  setBag,
  shopItems,
  balls,
  reroll,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(shopItems);

  useEffect(() => {
    setItems(shopItems);
  }, [shopItems]);

  const buyItem = (boughtItem) => {
    var newItems = items;

    for (let i = 0; i < shopItems.length; i++) {
      if (newItems[i] == boughtItem) {
        newItems[i] = "none";
        break;
      }
    }

    setItems(newItems);
    setBag((prevState) => [...prevState, boughtItem]);
    enqueueSnackbar(`You bought a ${boughtItem.split("|")[0]}`, {
      variant: "success",
    });
  };

  const buyPokeBall = () => {
    if (money >= 150) {
      setMoney(money - 150);
      setBalls((prevState) => (prevState += 1));
      enqueueSnackbar(`You bought a Pokeball!`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Not enough Money...`, {
        variant: "error",
      });
    }
  };

  const rerollShop = () => {
    if (money >= 500) {
      setItems(["none", "none", "none"]);
      reroll();
      enqueueSnackbar(`Rerolled the Shop`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`Not enough Money...`, {
        variant: "error",
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Button variant="contained" onClick={handleClickOpen}>
        <ShoppingCartIcon />
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        sx={{ overflow: "hidden" }}
      >
        <Box sx={{ backgroundColor: "#fafafa" }}>
          <DialogContent sx={{ overflow: "hidden" }}>
            <Grid
              container
              sx={{
                width: "30%",
                textAlign: "center",
                p: 1,
                borderRadius: "5px",
                border: "solid",
                borderWidth: "3px",
                borderColor: "gray",
                backgroundColor: "#f8f8f8",
                boxShadow: "0px 3px gray",
                mb: "3vh",
              }}
            >
              <Grid item xs={6}>
                <CatchingPokemonIcon />: {balls}
              </Grid>
              <Grid item xs={6}>
                <AttachMoneyIcon />: {money}
              </Grid>
            </Grid>
            {items.length ? (
              <Grid container spacing={1} sx={{ textAlign: "center" }}>
                {items.map((item, index) => {
                  return (
                    <ShopItem
                      name={item}
                      setBoughtItem={buyItem}
                      money={money}
                      setMoney={setMoney}
                      animTime={index * 400}
                    />
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5">No Items in the Shop</Typography>
              </Box>
            )}
            <Divider sx={{ mt: "1vh" }} />
            <Grid container sx={{ mt: "3vh" }}>
              <Grid item xs={6}>
                <Tooltip title={"Buy a Pokeball"} placement="top">
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => buyPokeBall()}
                    disabled={money < 150}
                    sx={{ width: "30%", height: "5vh" }}
                  >
                    <CatchingPokemonIcon />
                    <AttachMoneyIcon />
                    150
                  </Button>
                </Tooltip>
              </Grid>
              <Grid
                item
                direction="column"
                container
                sx={{ alignContent: "flex-end" }}
                xs={6}
              >
                <Button
                  fullWidth
                  variant="contained"
                  color="warning"
                  disabled={money < 500}
                  onClick={() => {
                    rerollShop();
                  }}
                  sx={{ height: "5vh" }}
                >
                  Reroll
                  <AttachMoneyIcon />
                  500
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Shop;
