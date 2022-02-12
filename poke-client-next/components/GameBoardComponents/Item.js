import React, { useState, useEffect } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
} from "@mui/material";

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

const Item = ({ name, items, team, setTeam, setItems, setMoney }) => {
  const [itemData, setItemData] = useState(null);
  const [open, setOpen] = useState(false);

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

  const getPos = () => {
    const w = 385; //width of sheet
    const h = 1152; //height of sheet

    const num = itemData.spritenum;

    const y = Math.floor(num / 16) * 24 * -1;
    const x = (num % 16) * 24 * -1;

    return x + "px " + y + "px";
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getItemData = async () => {
    const bRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/items/" + name.split("|")[0]
    );
    const itemData = await bRes.json();

    console.log(itemData);
    setItemData(itemData.data);
  };

  const giveItem = (index) => {
    var mon = team[index];

    const filteredTeam = team.filter(
      (mem) => JSON.stringify(mem) != JSON.stringify(mon)
    );
    console.log("giving item: " + name);
    mon.item = name;
    console.log("holding " + mon.item);
    setTeam([...filteredTeam, mon]);

    var newBag = items;
    let removed = false;
    for (let i = 0; i < newBag.length; i++) {
      if (newBag[i] == name && !removed) {
        newBag.splice(i, 1);
        removed = true;
      }
    }
    console.log(newBag);
    setItems(newBag);
    handleClose();
  };

  const sellItem = () => {
    var newBag = items;
    let removed = false;
    for (let i = 0; i < newBag.length; i++) {
      if (newBag[i] == name && !removed) {
        newBag.splice(i, 1);
        removed = true;
      }
    }
    console.log(newBag);
    setItems(newBag);

    setMoney((prevState) => prevState + getCost(name.split("|")[1]));
    handleClose();
  };

  useEffect(() => {
    getItemData();
  }, [name]);

  if (itemData) {
    const tooltip = (
      <React.Fragment>
        <div>
          <b>{name.split("|")[0]}</b>
        </div>
        <div>{itemData.desc}</div>
      </React.Fragment>
    );
    return (
      <Box sx={{ mb: ".5vh" }}>
        <HtmlTooltip title={tooltip}>
          <Button onClick={() => handleClickOpen()}>
            <Box
              sx={{
                width: "24px",
                height: "24px",
                backgroundImage: "url(/itemicons-sheet.png)",
                backgroundPosition: getPos(),
              }}
            ></Box>
          </Button>
        </HtmlTooltip>
        <Dialog fullWidth maxWidth={"sm"} open={open} onClose={handleClose}>
          <DialogTitle>Give {name.split("|")[0]}</DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: "1vh" }}>
              Team
            </Typography>
            <Grid container spacing={1}>
              {team.map((poke, index) => {
                return (
                  <Grid item xs={12}>
                    <Button
                      onClick={() => giveItem(index)}
                      disabled={poke.item != ""}
                      variant="outlined"
                      sx={{ fontSize: "18px" }}
                    >
                      {poke.species}
                    </Button>
                  </Grid>
                );
              })}
              <Grid item xs={12} sx={{ mt: "2vh" }}>
                <Button
                  onClick={() => sellItem()}
                  variant="contained"
                  color="error"
                >
                  Sell Item
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  return <div></div>;
};

export default Item;
