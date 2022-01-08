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
      return "https://archives.bulbagarden.net/media/upload/e/e3/FL_Viridian_Forest.png";
    case "Grassland Route":
      return "https://archives.bulbagarden.net/media/upload/0/01/HGSS_National_Park-Day.png";
    case "Mt.Moon":
      return "https://archives.bulbagarden.net/media/upload/2/2c/FL_Mt_Moon.png";
    case "Dark Cave":
      return "https://archives.bulbagarden.net/media/upload/4/4a/HGSS_Dark_Cave-Route_45-Morning.png";
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
