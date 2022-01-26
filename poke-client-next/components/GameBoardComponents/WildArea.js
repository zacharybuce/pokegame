import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
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
    case "Slowpoke Well":
      return "/SlowpokeWell.png";
    case "Ilex Forest":
      return "/IlexForest.png";
    case "Diglett's Cave":
      return "/DiglettsCave.png";
    case "Rock Tunnel":
      return "/RockTunnel.png";
    case "National Park":
      return "/NationalParkEvening.png";
    case "Safari Zone":
      return "/SafariZone.png";
    case "Ice Path":
      return "/IcePath.png";
    case "Power Plant":
      return "/PowerPlant.png";
    case "Rocket Hideout":
      return "/RocketHideout.png";
  }
};

const getAnim = (rarity) => {
  switch (rarity) {
    case "Common":
      return "common";
    case "Uncommon":
      return "uncommon";
    case "Rare":
      return "rare";
    case "Epic":
      return "epic";
    case "Legendary":
      return "legendary";
  }
};
const WildArea = ({ name, chooseArea, round }) => {
  const [tClass, setTClass] = useState();
  const [oppTeam, setOppTeam] = useState("error");

  const handleChooseTrainer = () => {
    if (oppTeam) chooseArea(name, true, oppTeam);
  };

  useEffect(async () => {
    if (name.startsWith("Trainer")) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_ROOT_URL + "/api/gettrainer/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trainerRarity: name.split("|")[0],
            round: round,
          }),
        }
      );
      const json = await res.json();
      setTClass(json.data.trainerClass);
      setOppTeam(json.data.pokemon);
    }
  }, []);

  if (!name.startsWith("Trainer"))
    return (
      <Grid item xs={4} sx={{ m: "2vh" }}>
        <Card className={getAnim(name.split("|")[1])}>
          <CardActionArea
            onClick={() => chooseArea(name.split("|")[0], false, "none")}
            sx={{ height: "100%" }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: "1vh" }}>
                {name.split("|")[0]}
              </Typography>
              <Box
                sx={{
                  backgroundImage:
                    "url(" + displayImg(name.split("|")[0]) + ")",
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

  if (tClass)
    return (
      <Grid item xs={4} sx={{ m: "2vh" }}>
        <Card className={getAnim(name.split("|")[1])}>
          <CardActionArea
            onClick={() => handleChooseTrainer()}
            sx={{ height: "100%" }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: "1vh" }}>
                {"Trainer Battle"}
              </Typography>
              <Box
                sx={{
                  backgroundImage: "url(/" + tClass + ".png)",
                  height: "160px",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "160px 160px",
                  backgroundPosition: "42px -7px",
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

  return (
    <Grid item xs={4} sx={{ m: "2vh" }}>
      <Card>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WildArea;
