import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";

const displayImg = (name) => {
  switch (name) {
    case "Viridian Forest":
      return "/HGSSViridianForest.png";
    case "Grassland Route":
      return "/NationalPark.png";
    case "Mt.Moon":
      return "/HGSSMtMoon.png";
    case "Dark Cave":
      return "/DarkCave.png";
    case "Sprout Tower":
      return "/SproutTower.png";
    case "Union Cave":
      return "/UnionCave.png";
  }
};

const WildArea = ({ name, chooseArea }) => {
  return (
    <Grid item xs={4}>
      <Card>
        <CardActionArea
          onClick={() => chooseArea(name)}
          sx={{ height: "100%" }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: "1vh" }}>
              {name}
            </Typography>
            {/* <Box
              component="img"
              src={displayImg(name)}
              sx={{ height: "160px", width: "256px" }}
            /> */}
            <Box
              sx={{
                backgroundImage: "url(" + displayImg(name) + ")",
                height: "160px",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                borderRadius: 1,
                border: "solid",
                borderWidth: "2px",
                borderColor: "lightgrey",
              }}
            ></Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default WildArea;
