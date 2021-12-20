import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import PokeStatDisplay from "./PokeStatDisplay";
import { useSnackbar } from "notistack";

export const BattleDisplay = ({ field, player1 }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [p1Poke, setP1Poke] = useState(null);
  const [p2Poke, setP2Poke] = useState(null);
  const [p1PokeHealth, setP1PokeHealth] = useState(100);
  const [p2PokeHealth, setP2PokeHealth] = useState(100);
  const [battleEnd, setBattleEnd] = useState(false);

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

    var stream = field.split(/\r?\n/);

    for (const token of stream) {
      snackDisplay(token);

      //Set the images and health on switches
      if (token.startsWith("|switch|p1a:")) {
        var splitToken = token.split("|");
        setP1Poke(splitToken[3].split(",")[0]);
        setP1PokeHealth(splitToken[4].split("/")[0]);
      }
      if (token.startsWith("|switch|p2a:")) {
        var splitToken = token.split("|");
        setP2Poke(splitToken[3].split(",")[0]);
        setP2PokeHealth(splitToken[4].split("/")[0]);
      }

      //set the health display on damage and heal
      if (
        (token.startsWith("|-damage|p1a:") &&
          token.split("|")[3].split("/")[1] == "100") ||
        token.startsWith("|-heal|p1a:")
      ) {
        var splitToken = token.split("|");
        setP1PokeHealth(splitToken[3].split("/")[0]);
      }
      if (
        (token.startsWith("|-damage|p2a:") &&
          token.split("|")[3].split("/")[1] == "100") ||
        token.startsWith("|-heal|p2a:")
      ) {
        var splitToken = token.split("|");
        setP2PokeHealth(splitToken[3].split("/")[0]);
      }

      //set health to 0 on faint
      if (token.startsWith("|faint|p1a:")) {
        setP1PokeHealth(0);
      }
      if (token.startsWith("|faint|p2a:")) {
        setP2PokeHealth(0);
      }
    }

    if (token.startsWith("|win")) {
      setBattleEnd(true);
    }

    delay = 300;
  };

  //set the contents of the snacks that display the battle info
  const snackDisplay = (token) => {
    if (token.startsWith("|move")) {
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

    if (token.startsWith("|-supereffective")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It was Super Effective!`, {
            variant: "success",
          }),
        delay
      );
      delay += addDelay;
    }

    if (token.startsWith("|-resisted")) {
      setTimeout(
        () =>
          enqueueSnackbar(`It was not vey effective...`, {
            variant: "warning",
          }),
        delay
      );
      delay += addDelay;
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
      delay += addDelay;
    }

    if (token.startsWith("|-heal")) {
      var splitToken = token.split("|");
      if (
        (splitToken[2].split(" ")[0] == "p1a:" && !p1Heal) ||
        (splitToken[2].split(" ")[0] == "p2a:" && !p2Heal)
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
        if (splitToken[2].split(" ")[0] == "p1a:") p1Heal = true;
        else p2Heal = true;
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
        var poke = splitToken[4].split(" ").at(-1);
        var ability = splitToken[3]
          .replace(/['"]+/g, "")
          .replace(/[\[\]]+/g, "");

        setTimeout(
          () =>
            enqueueSnackbar(`${poke} caused ${weather} ${ability}!`, {
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
  };

  useEffect(() => {
    fieldParser();
  }, [field]);

  const displayTrainerPoke = () => {
    if (p1Poke && p2Poke) {
      if (player1 && p1PokeHealth > 0) {
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/ani-back/" +
              p1Poke.toLowerCase() +
              ".gif"
            }
            alt={p1Poke}
          />
        );
      } else if (!player1 && p2PokeHealth > 0) {
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/ani-back/" +
              p2Poke.toLowerCase() +
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
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/ani/" +
              p1Poke.toLowerCase() +
              ".gif"
            }
            alt={p1Poke}
          />
        );
      } else if (player1 && p2PokeHealth > 0) {
        return (
          <img
            src={
              "http://play.pokemonshowdown.com/sprites/ani/" +
              p2Poke.toLowerCase() +
              ".gif"
            }
            alt={p2Poke}
          />
        );
      }
    }
  };

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item container>
          <Grid item xs={6}>
            <PokeStatDisplay
              health={!player1 ? p1PokeHealth : p2PokeHealth}
              name={!player1 ? p1Poke : p2Poke}
            />
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center" }}>
            {displayOpponentPoke() ? displayOpponentPoke() : <div></div>}
          </Grid>
        </Grid>

        <Grid item container>
          <Grid item xs={6} sx={{ textAlign: "center" }}>
            {displayTrainerPoke() ? displayTrainerPoke() : <div></div>}
          </Grid>
          <Grid item xs={6}>
            <PokeStatDisplay
              health={player1 ? p1PokeHealth : p2PokeHealth}
              name={player1 ? p1Poke : p2Poke}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
