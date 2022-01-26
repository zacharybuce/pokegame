import { Grid, Box, DialogContent, DialogTitle } from "@mui/material";
import React, { useState, useEffect } from "react";
import StarterCard from "./StarterCard";
import { useSnackbar } from "notistack";
import { useSocket } from "../../contexts/SocketProvider";

const Starter = ({ setTeam, handleClose }) => {
  const socket = useSocket();
  const { enqueueSnackbar } = useSnackbar();
  //const starters = ["Charmander", "Squirtle", "Bulbasaur"];
  const [starters, setStarters] = useState([]);

  useEffect(() => {
    socket.emit("get-starter");
  }, []);

  useEffect(() => {
    if (socket === undefined) return;

    socket.on("starter-mon", (starters) => setStarters(starters));
    return () => socket.off("starter-mon");
  }, [socket]);

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
        {starters ? (
          <Grid container spacing={1} sx={{ textAlign: "center" }}>
            {starters.map((starter) => {
              return (
                <StarterCard name={starter} chooseStarter={chooseStarter} />
              );
            })}
          </Grid>
        ) : (
          <div></div>
        )}
      </DialogContent>
    </Box>
  );
};

export default Starter;
