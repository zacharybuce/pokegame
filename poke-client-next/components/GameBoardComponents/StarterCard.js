import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";
import PokeIcon from "../PokeIcon";

const StarterCard = ({ name, chooseStarter }) => {
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
            <PokeIcon name={name} />
            <Typography>{name}</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default StarterCard;
