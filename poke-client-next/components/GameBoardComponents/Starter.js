import { Grid, Box, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import StarterCard from "./StarterCard";
import { useSnackbar } from "notistack";

const Starter = ({ setTeam, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const starters = ["Charmander", "Squirtle", "Bulbasaur"];

  const chooseStarter = async (poke) => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/genmon/" + poke
    );
    const data = await res.json();

    setTeam([data.data]);
    enqueueSnackbar(`You choose ${poke}!`, {
      variant: "success",
    });
    handleClose();
  };

  return (
    <Box sx={{ backgroundColor: "#fafafa" }}>
      <DialogTitle>Choose your Starter</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} sx={{ textAlign: "center" }}>
          {starters.map((starter) => {
            return <StarterCard name={starter} chooseStarter={chooseStarter} />;
          })}
        </Grid>
      </DialogContent>
    </Box>
  );
};

export default Starter;
