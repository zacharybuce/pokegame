import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Slide,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

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

const WildArea = ({
  name,
  chooseArea,
  round,
  animTime,
  chooseTClass,
  setChooseTClass,
}) => {
  const [oppTeam, setOppTeam] = useState("error");
  const [tClass, setTClass] = useState();
  const [possibleEncounters, setPossibleEncounters] = useState({
    pokemon: [],
    rates: [],
  });
  const [possibleTrainerMon, setPossibleTrainerMon] = useState([]);

  const getEncounters = async () => {
    const encRes = await fetch(
      process.env.NEXT_PUBLIC_ROOT_URL + "/api/encounters/" + name.split("|")[0]
    );

    const encJson = await encRes.json();
    console.log(encJson);
    const encounters = encJson.data;

    setPossibleEncounters(encounters);
  };

  const handleChooseTrainer = () => {
    if (oppTeam) {
      chooseArea(name, true, oppTeam);
      setChooseTClass(tClass);
    }
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
      setPossibleTrainerMon(json.data.possibleMon);
    } else {
      getEncounters();
    }
  }, []);

  if (!name.startsWith("Trainer") && possibleEncounters)
    return (
      <Grid item xs={12} md={4} sx={{ mt: "2vh", mb: "2vh" }}>
        <Slide in={true} direction="up" timeout={animTime + 100}>
          <Card className={getAnim(name.split("|")[1])}>
            <CardActionArea
              onClick={() => chooseArea(name.split("|")[0], false, "none")}
              sx={{ height: "100%" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: "1vh" }}>
                  {name.split("|")[0]}
                </Typography>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography variant="h6">Possible Encounters</Typography>
                      {possibleEncounters.pokemon.map((mon, index) => {
                        return (
                          <div>
                            {mon} {possibleEncounters.rates[index]}%
                          </div>
                        );
                      })}
                    </React.Fragment>
                  }
                >
                  <Box
                    sx={{
                      backgroundImage:
                        "url(/" +
                        name.split("|")[0].replace(/['. ]+/g, "") +
                        ".png)",
                      height: ["30px", "30px", "160px"],
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      borderRadius: 1,
                      border: "solid",
                      borderWidth: "2px",
                      borderColor: "lightgrey",
                    }}
                  ></Box>
                </HtmlTooltip>
              </CardContent>
            </CardActionArea>
          </Card>
        </Slide>
      </Grid>
    );

  if (tClass && possibleTrainerMon)
    return (
      <Grid item xs={12} md={4} sx={{ m: "2vh" }}>
        <Slide in={true} direction="up" timeout={animTime + 100}>
          <Card className={getAnim(name.split("|")[1])}>
            <CardActionArea
              onClick={() => handleChooseTrainer()}
              sx={{ height: "100%" }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: "1vh" }}>
                  {tClass}
                </Typography>
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <Typography variant="h6">Possible Pokemon</Typography>
                      {possibleTrainerMon.map((mon) => {
                        return <div>{mon}</div>;
                      })}
                    </React.Fragment>
                  }
                >
                  <Box
                    sx={{
                      backgroundImage: "url(/" + tClass + ".png)",
                      height: ["30px", "30px", "160px"],
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "160px 160px",
                      backgroundPosition: "42px -7px",
                      borderRadius: 1,
                      border: "solid",
                      borderWidth: "2px",
                      borderColor: "lightgrey",
                    }}
                  ></Box>
                </HtmlTooltip>
              </CardContent>
            </CardActionArea>
          </Card>
        </Slide>
      </Grid>
    );

  return (
    <Grid item xs={12} md={4} sx={{ m: "2vh" }}>
      <Card>
        <CardContent>
          <CircularProgress />
        </CardContent>
      </Card>
    </Grid>
  );
};

export default WildArea;
