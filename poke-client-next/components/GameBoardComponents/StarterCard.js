import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

const StarterCard = ({ name, chooseStarter }) => {
  const [pokeData, setPokeData] = useState(null);

  const getPokeData = async () => {
    const bRes = await fetch("http://localhost:3000/api/pokemon/" + name);
    const pokeData = await bRes.json();
    setPokeData(pokeData.data);
  };

  useEffect(() => {
    getPokeData();
  }, [name]);

  if (pokeData)
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
            textAlign: "center",
            minWidth: 200,
          }}
        >
          <CardActionArea
            onClick={() => chooseStarter(name)}
            sx={{ height: "100%" }}
          >
            <CardContent>
              <img
                src={
                  "https://veekun.com/dex/media/pokemon/icons/" +
                  pokeData.num +
                  ".png"
                }
              />
              <Typography>{name}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );

  return <div></div>;
};

export default StarterCard;
