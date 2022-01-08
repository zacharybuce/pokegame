import { Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const PokeStats = ({ poke }) => {
  const [stats, setStats] = useState();

  const getStats = async () => {
    const res = await fetch("http://localhost:3000/api/getstats/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(poke),
    });
    const data = await res.json();

    setStats(data.data);
  };

  useEffect(() => {
    getStats();
  }, [poke]);

  if (stats)
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Stats</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>HP: {stats.hp}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Speed: {stats.spe}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Attack: {stats.atk}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Special Attack: {stats.spa}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Defence: {stats.def}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Special Defence: {stats.spd}</Typography>
        </Grid>
      </Grid>
    );

  return <div></div>;
};

export default PokeStats;
