import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import PokeStatDisplay from "./PokeStatDisplay";
import { useSnackbar } from "notistack";
import StatusDisplay from "./StatusDisplay";
import { WeatherDisplay } from "./WeatherDisplay";
import { FieldEffectDisplay } from "./FieldEffectDisplay";

export const BattleDisplay = ({
  field,
  player1,
  id,
  setBattleEnd,
  setRewards,
  setAnimsDone,
  setMonKOed,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [p1Poke, setP1Poke] = useState(null);
  const [p1PokeShiny, setP1PokeShiny] = useState(false);
  const [p2Poke, setP2Poke] = useState(null);
  const [p2PokeShiny, setP2PokeShiny] = useState(false);
  const [p1PokeHealth, setP1PokeHealth] = useState(100);
  const [p2PokeHealth, setP2PokeHealth] = useState(100);
  const [p1PokeStatus, setP1PokeStatus] = useState([]);
  const [p2PokeStatus, setP2PokeStatus] = useState([]);
  const [weather, setWeather] = useState("none");
  const [fieldEffectsP1, setFieldEffectsP1] = useState([]);
  const [fieldEffectsP2, setFieldEffectsP2] = useState([]);
  const [p1Sprite, setP1Sprite] = useState();
  const [p2Sprite, setP2Sprite] = useState();

  var initialSwitch = true;
  var delay = 300;
  var p1Heal = false;
  var p2Heal = false;
  var p1Fnt = false;
  var p2Fnt = false;
  var p1Status = false;
  var p2Status = false;
  const addDelay = 1500;

  const fieldParser = () => {
    var p1Set = false;
    var p2Set = false;
    setAnimsDone(false);

    var stream = field.split(/\r?\n/);

    for (const token of stream) {
      snackDisplay(token);

      //Set the images and health on switches
      if (token.startsWith("|switch|p1a:") || token.startsWith("|drag|p1a:")) {
        // if (initialSwitch) delay = 0;

        // setTimeout(() => {

        var splitToken = token.split("|");
        setP1Poke(splitToken[3].split(",")[0]);
        setP1PokeHealth(splitToken[4].split("/")[0]);
        setSprite("p1", splitToken[3].split(",")[0]);
        setP1PokeStatus([]);

        //setShiny
        if (splitToken[3].split(",")[3]) setP1PokeShiny(true);
        else setP1PokeShiny(false);
        console.log(splitToken[4].split(" ")[1]);
        //set status on switch in
        if (splitToken[4].split(" ").length > 1) {
          setP1PokeStatus((prevState) => [
            ...prevState,
            "status|" + splitToken[4].split(" ")[1],
          ]);
        }

        // }, delay);
        // delay += addDelay;
      }
      if (token.startsWith("|switch|p2a:") || token.startsWith("|drag|p2a:")) {
        // if (initialSwitch) delay = 0;

        // setTimeout(() => {

        var splitToken = token.split("|");
        setP2Poke(splitToken[3].split(",")[0]);
        setP2PokeHealth(splitToken[4].split("/")[0]);
        setSprite("p2", splitToken[3].split(",")[0]);
        setP2PokeStatus([]);

        //setShiny
        if (splitToken[3].split(",")[3]) setP2PokeShiny(true);
        else setP2PokeShiny(false);

        //set status on switch in
        if (splitToken[4].split(" ").length > 1) {
          console.log(splitToken[4].split(" ")[1]);
          setP2PokeStatus(["status|" + splitToken[4].split(" ")[1]]);
        }

        // }, delay);
        // delay += addDelay;
        initialSwitch = false;
      }

      //set the health display on damage and heal
      if (
        (token.startsWith("|-damage|") || token.startsWith("|-heal|")) &&
        token.split("|")[3] != "0 fnt"
      ) {
        if (
          (token.startsWith("|-damage|p1a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          (token.startsWith("|-heal|p1a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          (token.startsWith("|-damage|p1a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100") ||
          (token.startsWith("|-heal|p1a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100")
        ) {
          var splitToken = token.split("|");
          setTimeout(() => setP1PokeHealth(splitToken[3].split("/")[0]), delay);
          delay += addDelay;
        }
        if (
          (token.startsWith("|-damage|p2a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          (token.startsWith("|-heal|p2a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          (token.startsWith("|-damage|p2a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100") ||
          (token.startsWith("|-heal|p2a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100")
        ) {
          var splitToken = token.split("|");
          setTimeout(() => setP2PokeHealth(splitToken[3].split("/")[0]), delay);
          delay += addDelay;
        }
      }
      //set health to 0 on faint
      if (token.startsWith("|faint|p1a:")) {
        if (!player1) setMonKOed((prevState) => prevState + 1);
        setTimeout(() => setP1PokeHealth(0), delay);
        delay += addDelay;
      }
      if (token.startsWith("|faint|p2a:")) {
        if (player1) {
          console.log("p2 faint +1 to p1");
          setMonKOed((prevState) => prevState + 1);
        }
        setTimeout(() => setP2PokeHealth(0), delay);
        delay += addDelay;
      }

      //set status
      if (token.startsWith("|-status|p1a:")) {
        var splitToken = token.split("|");
        console.log("in stat");
        setTimeout(
          () =>
            setP1PokeStatus((prevState) => [
              ...prevState,
              "status|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-status|p2a:")) {
        var splitToken = token.split("|");
        setTimeout(
          () =>
            setP2PokeStatus((prevState) => [
              ...prevState,
              "status|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }

      //cure status
      if (token.startsWith("|-curestatus|p1a:")) {
        var splitToken = token.split("|");
        const newStatuses = p1PokeStatus.filter(
          (status) => !status.includes(splitToken[3])
        );
        setTimeout(() => setP1PokeStatus(newStatuses), delay);
        delay += addDelay;
      }
      if (token.startsWith("|-curestatus|p2a:")) {
        var splitToken = token.split("|");
        const newStatuses = p1PokeStatus.filter(
          (status) => !status.includes(splitToken[3])
        );
        setTimeout(() => setP2PokeStatus(newStatuses), delay);
        delay += addDelay;
      }

      if (token.startsWith("|-end|p1a:")) {
        var splitToken = token.split("|");
        const newStatuses = p1PokeStatus.filter(
          (status) => !status.includes(splitToken[3])
        );
        setTimeout(() => setP1PokeStatus(newStatuses), delay);
        delay += addDelay;
      }
      if (token.startsWith("|-end|p2a:")) {
        var splitToken = token.split("|");
        const newStatuses = p2PokeStatus.filter(
          (status) => !status.includes(splitToken[3])
        );
        setTimeout(() => setP2PokeStatus(newStatuses), delay);
        delay += addDelay;
      }

      //side effects
      if (token.startsWith("|-sidestart|p1:")) {
        var splitToken = token.split("|");
        const effect = splitToken[3];
        setTimeout(
          () => setFieldEffectsP1((prevState) => [...prevState, effect]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-sidestart|p2:")) {
        var splitToken = token.split("|");
        const effect = splitToken[3];
        setTimeout(
          () => setFieldEffectsP2((prevState) => [...prevState, effect]),
          delay
        );
        delay += addDelay;
      }

      //end side effect
      if (token.startsWith("|-sideend|p1:")) {
        var splitToken = token.split("|");
        const effectTok = splitToken[3];

        const newArr = fieldEffectsP1.filter(
          (effect) => !effect.includes(effectTok)
        );

        setTimeout(() => setFieldEffectsP1(newArr), delay);
        delay += addDelay;
      }
      if (token.startsWith("|-sideend|p2:")) {
        var splitToken = token.split("|");
        const effectTok = splitToken[3];

        const newArr = fieldEffectsP2.filter(
          (effect) => !effect.includes(effectTok)
        );

        setTimeout(() => setFieldEffectsP2(newArr), delay);
        delay += addDelay;
      }

      //weather
      if (token.startsWith("|-weather")) {
        var splitToken = token.split("|");
        const weather = splitToken[2];
        setTimeout(() => setWeather(weather), delay);
        delay += addDelay;
      }

      //set boost and unboost
      if (token.startsWith("|-unboost|p1a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP1PokeStatus((prevState) => [
              ...prevState,
              "unboost|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-unboost|p2a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP2PokeStatus((prevState) => [
              ...prevState,
              "unboost|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-boost|p1a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP1PokeStatus((prevState) => [
              ...prevState,
              "boost|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-boost|p2a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP2PokeStatus((prevState) => [
              ...prevState,
              "boost|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-setboost|p1a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP1PokeStatus((prevState) => [
              ...prevState,
              "setboost|" + splitToken[3] + "|" + splitToken[4],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-setboost|p2a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP2PokeStatus((prevState) => [
              ...prevState,
              "setboost|" + splitToken[3] + "|" + splitToken[4],
            ]),
          delay
        );
        delay += addDelay;
      }

      if (token.startsWith("|-start|p1a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP1PokeStatus((prevState) => [
              ...prevState,
              "effect|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }
      if (token.startsWith("|-start|p2a:")) {
        var splitToken = token.split("|");

        setTimeout(
          () =>
            setP2PokeStatus((prevState) => [
              ...prevState,
              "effect|" + splitToken[3],
            ]),
          delay
        );
        delay += addDelay;
      }

      if (token.startsWith("|win")) {
        var splitToken = token.split("|");
        var winner = splitToken[2];
        setTimeout(() => {
          if (id == winner.replace(/['"]+/g, "")) setRewards(1000, 1, true);
          else setRewards(0, 1, false);
          setBattleEnd(true);
        }, delay);
      }
    } //end tok

    setTimeout(() => setAnimsDone(true), delay);
    delay = 300;
  };

  //set the contents of the snacks that display the battle info
  const snackDisplay = (token) => {
    if (token.startsWith("|move")) {
      var splitToken = token.split("|");
      var opp = splitToken[4].split(" ")[1];

      if (opp != undefined) {
        var user = splitToken[2].split(" ")[1];
        var move = splitToken[3];

        setTimeout(
          () => enqueueSnackbar(`${user} used ${move} on ${opp}`),
          delay
        );
        delay += addDelay;
      }
    }

    if (token.startsWith("|-supereffective")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It was Super Effective!`, {
            variant: "success",
          }),
        delay
      );
      //delay += addDelay;
    }

    if (token.startsWith("|-crit")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It was a Critical Hit!`, {
            variant: "success",
          }),
        delay
      );
      //delay += addDelay;
    }

    if (token.startsWith("|-resisted")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It was not vey effective...`, {
            variant: "warning",
          }),
        delay
      );
      //delay += addDelay;
    }

    if (token.startsWith("|-immune")) {
      var splitToken = token.split("|");
      var poke = splitToken[2].split(" ")[1];

      setTimeout(
        () =>
          enqueueSnackbar(`${poke} is immune!`, {
            variant: "error",
          }),
        delay
      );
      //delay += addDelay;
    }

    if (token.startsWith("|-heal")) {
      var splitToken = token.split("|");
      if (
        (splitToken[2].split(" ")[0] == "p1a:" && p1Heal != splitToken[4]) ||
        (splitToken[2].split(" ")[0] == "p2a:" && p2Heal != splitToken[4])
      ) {
        var user = splitToken[2].split(" ")[1];
        if (splitToken.length > 4) var item = splitToken[4].split(" ").at(-1);
        else var item = "move";
        setTimeout(
          () =>
            enqueueSnackbar(`${user} healed with ${item}`, {
              variant: "info",
            }),
          delay
        );
        delay += addDelay;
        if (splitToken[2].split(" ")[0] == "p1a:") p1Heal = splitToken[4];
        else p2Heal = splitToken[4];
      }
    }

    if (token.startsWith("|-damage")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];

      if (splitToken[3].split(" ").at(-1) == "fnt") {
        if (
          (splitToken[2].split(" ")[0] == "p1a:" && !p1Fnt) ||
          (splitToken[2].split(" ")[0] == "p2a:" && !p2Fnt)
        ) {
          setTimeout(
            () =>
              enqueueSnackbar(`${user} fainted!`, {
                variant: "error",
              }),
            delay
          );
          delay += addDelay;
          if (splitToken[2].split(" ")[0] == "p1a:") p1Fnt = true;
          else p2Fnt = true;
        }
      }

      if (
        ((splitToken[2].split(" ")[0] == "p1a:" && !p1Status) ||
          (splitToken[2].split(" ")[0] == "p2a:" && !p2Status)) &&
        splitToken.length == 5
      ) {
        setTimeout(
          () =>
            enqueueSnackbar(
              `${user} was hurt from ${splitToken[4].split(" ").at(-1)}!`,
              {
                variant: "error",
              }
            ),
          delay
        );
        delay += addDelay;
        if (splitToken[2].split(" ")[0] == "p1a:") p1Status = true;
        else p2Status = true;
      }
    }

    if (token.startsWith("|cant")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];

      if (splitToken.length == 4) {
        var preventMove = splitToken[3];
        setTimeout(
          () =>
            enqueueSnackbar(`${user} is ${preventMove} !`, {
              variant: "error",
            }),
          delay
        );
        delay += addDelay;
      }

      if (splitToken.length == 5) {
        var move = splitToken[4];
        var preventMove = splitToken[3].split(" ")[1];

        setTimeout(
          () =>
            enqueueSnackbar(
              `${user} cant use ${move} because of ${preventMove}`,
              { variant: "error" }
            ),
          delay
        );
        delay += addDelay;
      }
    }

    if (token.startsWith("|-fail")) {
      setTimeout(
        () => enqueueSnackbar(`The move Failed!`, { variant: "error" }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-status")) {
      var splitToken = token.split("|");
      var poke = splitToken[2].split(" ")[1];
      var status = splitToken[3];
      if (splitToken.length == 5) {
        var cause = JSON.stringify(splitToken[4]).replace(/['"]+/g, "");
        cause = cause.replace(/[\[\]]+/g, "");

        setTimeout(
          () =>
            enqueueSnackbar(`${poke} is now ${status} ${cause}!`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }

      if (splitToken.length == 4) {
        setTimeout(
          () =>
            enqueueSnackbar(`${poke} is now ${status}!`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }
    }

    if (token.startsWith("|-curestatus")) {
      var splitToken = token.split("|");
      var poke = splitToken[2].split(" ")[1];
      var status = splitToken[3];

      setTimeout(
        () =>
          enqueueSnackbar(`${poke} is no longer ${status}!`, {
            variant: "success",
          }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-miss")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It missed...`, {
            variant: "error",
          }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-weather")) {
      var splitToken = token.split("|");

      if (splitToken.length == 5) {
        var weather = splitToken[2].split(" ")[1];
        if (weather == undefined) weather = splitToken[2];
        var poke = splitToken[4].split(" ").at(-1);
        var ability = splitToken[3]
          .replace(/['"]+/g, "")
          .replace(/[\[\]]+/g, "");

        setTimeout(
          () =>
            enqueueSnackbar(`${poke} caused ${weather} ${ability} !`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }

      if (splitToken.length == 4) {
        var weather = splitToken[2];
        setTimeout(
          () =>
            enqueueSnackbar(`The ${weather} continues...`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }

      if (splitToken.length == 3) {
        if (splitToken[2] == "none") {
          setTimeout(() => {
            enqueueSnackbar(`The weather stopped...`, {
              variant: "warning",
            });
            setWeather("none");
          }, delay);
          delay += addDelay;
        }
      }
    }

    if (token.startsWith("|-enditem")) {
      var splitToken = token.split("|");
      var poke = splitToken[2].split(" ")[1];
      var item = splitToken[3];
      setTimeout(
        () =>
          enqueueSnackbar(`${poke}'s ${item} was destroyed!`, {
            variant: "warning",
          }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-activate")) {
      var splitToken = token.split("|");

      if (splitToken.length == 4) {
        var poke = splitToken[2].split(" ")[1];
        var ability = splitToken[3].replace(/[:]+/g, "");
        setTimeout(
          () =>
            enqueueSnackbar(`${poke}'s ${ability} was activated!`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }
      if (splitToken.length == 5) {
        var ability = splitToken[3].split(" ")[1];
        setTimeout(
          () =>
            enqueueSnackbar(`${ability} was activated!`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }
    }

    if (token.startsWith("|-end")) {
      var splitToken = token.split("|");
      if (splitToken.length == 4) {
        var item = splitToken[3];
        setTimeout(
          () =>
            enqueueSnackbar(`${item} ended!`, {
              variant: "warning",
            }),
          delay
        );
        delay += addDelay;
      }
    }

    if (token.startsWith("|-anim")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];
      var move = splitToken[3];
      var opp = splitToken[4].split(" ")[1];
      setTimeout(
        () => enqueueSnackbar(`${user} used ${move} on ${opp}`),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-prepare")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];
      var move = splitToken[3];

      setTimeout(() => enqueueSnackbar(`${user} is preparing ${move}`), delay);
      delay += addDelay;
    }

    if (token.startsWith("|-ability")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];
      var ability = splitToken[3];

      setTimeout(
        () =>
          enqueueSnackbar(`${user}'s ${ability} was activated!`, {
            variant: "warning",
          }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-start") && token.includes("ability:")) {
      var splitToken = token.split("|");
      var user = splitToken[2].split(" ")[1];
      var ability = splitToken[3].split(":")[1];

      setTimeout(
        () =>
          enqueueSnackbar(`${user}'s ${ability} was activated!`, {
            variant: "warning",
          }),
        delay
      );
      delay += addDelay;
    }

    // if (token.startsWith("|win")) {
    //   var splitToken = token.split("|");
    //   var winner = splitToken[2];
    //   setTimeout(
    //     () =>
    //       enqueueSnackbar(`${winner} won the battle!`, {
    //         variant: "info",
    //       }),
    //     delay
    //   );
    //   delay += addDelay;
    // }
  };

  const setSprite = async (player, poke) => {
    if (player == "p1") {
      let res = await fetch(
        process.env.NEXT_PUBLIC_ROOT_URL + "/api/pokemon/" + poke
      );
      let spriteId = await res.json();

      setP1Sprite(spriteId.data.spriteid);
    } else {
      let res = await fetch(
        process.env.NEXT_PUBLIC_ROOT_URL + "/api/pokemon/" + poke
      );
      let spriteId = await res.json();

      setP2Sprite(spriteId.data.spriteid);
    }
  };

  useEffect(async () => {
    fieldParser();
  }, [field]);

  const displayTrainerPoke = () => {
    if (p1Sprite && p2Sprite) {
      if (player1 && p1PokeHealth > 0) {
        let url = p1PokeShiny ? "ani-back-shiny/" : "ani-back/";
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/" +
              url +
              p1Sprite +
              ".gif"
            }
            alt={p1Poke}
          />
        );
      } else if (!player1 && p2PokeHealth > 0) {
        let url = p2PokeShiny ? "ani-back-shiny/" : "ani-back/";
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/" +
              url +
              p2Sprite +
              ".gif"
            }
            alt={p2Poke}
          />
        );
      }
    }
  };

  const displayOpponentPoke = () => {
    if (p1Poke && p2Poke) {
      if (!player1 && p1PokeHealth > 0) {
        let url = p1PokeShiny ? "ani-shiny/" : "ani/";
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/" +
              url +
              p1Sprite +
              ".gif"
            }
            alt={p1Poke}
          />
        );
      } else if (player1 && p2PokeHealth > 0) {
        let url = p2PokeShiny ? "ani-shiny/" : "ani/";
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/" +
              url +
              p2Sprite +
              ".gif"
            }
            alt={p2Poke}
          />
        );
      }
    }
  };

  return (
    <Box sx={{}}>
      <Grid container spacing={1}>
        <Grid
          item
          container
          xs={3}
          sx={{
            p: 1,
            borderRadius: 3,
            border: "solid",
            borderColor: "gray",
            borderWidth: "1px",
            mb: "1vh",
            fontSize: "20px",
          }}
        >
          <Grid item xs={9} sx={{ textAlign: "center" }}>
            Weather:
          </Grid>
          <Grid item xs={3} sx={{ pt: "4px" }}>
            <WeatherDisplay weather={weather} />
          </Grid>
        </Grid>
        <Grid item container sx={{ height: "140px" }}>
          <Grid item xs={6}>
            <PokeStatDisplay
              health={!player1 ? p1PokeHealth : p2PokeHealth}
              name={!player1 ? p1Poke : p2Poke}
            />
            <StatusDisplay statuses={!player1 ? p1PokeStatus : p2PokeStatus} />
          </Grid>
          <Grid item xs={5} sx={{ textAlign: "center", position: "relative" }}>
            <Box sx={{}}>
              {displayOpponentPoke() ? displayOpponentPoke() : <div></div>}
            </Box>
          </Grid>
          <Grid item xs={1}>
            <FieldEffectDisplay
              fieldEffects={!player1 ? fieldEffectsP1 : fieldEffectsP2}
            />
          </Grid>
        </Grid>

        <Grid item container sx={{ height: "140px" }}>
          <Grid item xs={1}>
            <FieldEffectDisplay
              fieldEffects={player1 ? fieldEffectsP1 : fieldEffectsP2}
            />
          </Grid>
          <Grid item xs={5} sx={{ textAlign: "center" }}>
            <Box
              sx={{
                "&::after": {
                  position: "absolute",
                  width: "100px",
                  height: "80px",
                  // backgroundColor: "pink",
                  opacity: 0.4,
                  content: "''",
                  left: "25%",
                  // boxShadow: "5px -5px #f095da",
                },
              }}
            >
              {displayTrainerPoke() ? displayTrainerPoke() : <div></div>}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <PokeStatDisplay
              health={player1 ? p1PokeHealth : p2PokeHealth}
              name={player1 ? p1Poke : p2Poke}
            />
            <StatusDisplay statuses={player1 ? p1PokeStatus : p2PokeStatus} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
