import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  speedDialIconClasses,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShopItem from "./ShopItem";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import { useSnackbar } from "notistack";

const Shop = ({ money, setMoney, setBalls, setBag, shopItems }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(shopItems);
  // const [boughtItem, setBoughtItem] = useState();

  useEffect(() => {
    setItems(shopItems);
  }, [shopItems]);

  // useEffect(() => {
  //   if (!boughtItem) return;

  //   setItems(
  //     items.filter(function (item) {
  //       //if (item == boughtItem) return "none";
  //       return item !== boughtItem;
  //     })
  //   );

  //   setBag((prevState) => [...prevState, boughtItem]);
  //   enqueueSnackbar(`You bought a ${boughtItem.split("|")[0]}`, {
  //     variant: "success",
  //   });
  // }, [boughtItem]);

  const buyItem = (boughtItem) => {
    var newItems = items;

    for (let i = 0; i < shopItems.length; i++) {
      if (newItems[i] == boughtItem) {
        newItems.splice(i, 1);
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
      >
        <Box sx={{ backgroundColor: "#fafafa" }}>
          <DialogTitle>Shop</DialogTitle>
          <DialogContent>
            {items.length ? (
              <Grid container spacing={1} sx={{ textAlign: "center" }}>
                {items.map((item) => {
                  return (
                    <ShopItem
                      name={item}
                      setBoughtItem={buyItem}
                      money={money}
                      setMoney={setMoney}
                    />
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5">No Items in the Shop</Typography>
              </Box>
            )}
            <Grid item xs={12}>
              <Tooltip title={"Buy a Pokeball"}>
                <Button onClick={() => buyPokeBall()}>
                  <CatchingPokemonIcon />
                </Button>
              </Tooltip>
              cost: 150
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Shop;
