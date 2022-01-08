import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import PokeIcon from "../PokeIcon";
import PokeInfo from "./PokeInfo";
import PokeStats from "./PokeStats";

const PokemonPiece = ({ poke }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    console.log(poke);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (poke)
    return (
      <Box sx={{ backgroundColor: "lightgray" }}>
        <Button
          onClick={() => handleClickOpen()}
          sx={{ backgroundColor: "white" }}
        >
          {poke ? <PokeIcon name={poke.species} /> : <div></div>}
        </Button>
        <Dialog
          fullWidth={true}
          maxWidth={"md"}
          open={open}
          onClose={handleClose}
        >
          <Box sx={{ backgroundColor: "#fafafa" }}>
            <DialogTitle>
              {poke.species} Lvl: {poke.level}
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <PokeInfo poke={poke} />
                </Grid>
                <Grid item xs={6} sx={{ mt: "1vh" }}>
                  <PokeStats poke={poke} />
                </Grid>
              </Grid>
            </DialogContent>
          </Box>
        </Dialog>
      </Box>
    );

  return <div></div>;
};

export default PokemonPiece;
