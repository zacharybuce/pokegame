import { Button, Grid, Typography, Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import CookieIcon from "@mui/icons-material/Cookie";

const PokeStats = ({ poke, statInc, candies, candiesUsed }) => {
  const [stats, setStats] = useState();
  const getStats = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/getstats/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(poke),
      }
    );
    const data = await res.json();

    setStats(data.data);
  };

  useEffect(() => {
    getStats();
  }, [poke, candies]);

  if (stats)
    return (
      <Grid container sx={{ mt: "1vh" }}>
        <Grid item container xs={12}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 0.5,
                backgroundColor: "#98c8e0",
                borderRadius: 1,
                border: "solid",
                borderLeftWidth: "0px",
                fontSize: "20px",
                boxShadow: 2,
                width: "150px",
                textAlign: "center",
                borderColor: "gray",
              }}
            >
              Stats
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: "1vh", mb: "1vh" }}>
            <Box
              sx={{
                backgroundColor: "lightgrey",
                width: "130px",
                textAlign: "center",
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              Candies used: {candiesUsed}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.hp != 252 ? (
                <Button
                  onClick={() => statInc("hp")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.hp / 28 + 1}
                >
                  <CookieIcon /> {poke.evs.hp / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              HP: {stats.hp}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.spe != 252 ? (
                <Button
                  onClick={() => statInc("spe")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.spe / 28 + 1}
                >
                  <CookieIcon />
                  {poke.evs.spe / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              Speed: {stats.spe}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.atk != 252 ? (
                <Button
                  onClick={() => statInc("atk")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.atk / 28 + 1}
                >
                  <CookieIcon />
                  {poke.evs.atk / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              Attack: {stats.atk}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.spa != 252 ? (
                <Button
                  onClick={() => statInc("spa")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.spa / 28 + 1}
                >
                  <CookieIcon />
                  {poke.evs.spa / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              Special Attack: {stats.spa}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.def != 252 ? (
                <Button
                  onClick={() => statInc("def")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.def / 28 + 1}
                >
                  <CookieIcon />
                  {poke.evs.def / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              Defence: {stats.def}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>
              {poke.evs.spd != 252 ? (
                <Button
                  onClick={() => statInc("spd")}
                  variant="contained"
                  sx={{ mr: "1vw" }}
                  disabled={candies < poke.evs.spd / 28 + 1}
                >
                  <CookieIcon />
                  {poke.evs.spd / 28 + 1}
                </Button>
              ) : (
                ""
              )}{" "}
              Special Defence: {stats.spd}
            </Typography>
          </Grid>
        </Grid>

        <Grid item container xs={6} sx={{ mt: "2vh" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 0.5,
                backgroundColor: "#98c8e0",
                borderRadius: 1,
                border: "solid",
                borderLeftWidth: "0px",
                fontSize: "18px",
                boxShadow: 2,
                width: "100px",
                textAlign: "center",
                borderColor: "gray",
                mb: "1vh",
              }}
            >
              EVs
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>HP: {poke.evs.hp}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Speed: {poke.evs.spe}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Attack: {poke.evs.atk}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Special Attack: {poke.evs.spa}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Defence: {poke.evs.def}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Special Defence: {poke.evs.spd}</Typography>
          </Grid>
        </Grid>

        <Grid item container xs={6} sx={{ mt: "2vh" }}>
          <Grid item xs={12}>
            <Box
              sx={{
                p: 0.5,
                backgroundColor: "#98c8e0",
                borderRadius: 1,
                border: "solid",
                borderLeftWidth: "0px",
                fontSize: "18px",
                boxShadow: 2,
                width: "100px",
                textAlign: "center",
                borderColor: "gray",
                mb: "1vh",
              }}
            >
              IVs
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Typography>HP: {poke.ivs.hp}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Speed: {poke.ivs.spe}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Attack: {poke.ivs.atk}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Special Attack: {poke.ivs.spa}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Defence: {poke.ivs.def}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Special Defence: {poke.ivs.spd}</Typography>
          </Grid>
        </Grid>
      </Grid>
    );

  return <div></div>;
};

export default PokeStats;
