import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import PokeStatDisplay from "./PokeStatDisplay";
import { useSnackbar } from "notistack";
import StatusDisplay from "./StatusDisplay";

export const BattleDisplay = ({
  field,
  player1,
  id,
  setBattleEnd,
  setRewards,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [p1Poke, setP1Poke] = useState(null);
  const [p2Poke, setP2Poke] = useState(null);
  const [p1PokeHealth, setP1PokeHealth] = useState(100);
  const [p2PokeHealth, setP2PokeHealth] = useState(100);
  const [p1PokeStatus, setP1PokeStatus] = useState([]);
  const [p2PokeStatus, setP2PokeStatus] = useState([]);

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
      if (token.startsWith("|switch|p1a:") || token.startsWith("|drag|p1a:")) {
        setP1PokeStatus([]);

        var splitToken = token.split("|");
        setP1Poke(splitToken[3].split(",")[0]);
        setP1PokeHealth(splitToken[4].split("/")[0]);
        //set status on switch in
        if (splitToken[4].split(" ").length == 2)
          setP1PokeStatus((prevState) => [
            ...prevState,
            "status " + splitToken[4].split(" ")[1],
          ]);
      }
      if (token.startsWith("|switch|p2a:") || token.startsWith("|drag|p2a:")) {
        setP2PokeStatus([]);

        var splitToken = token.split("|");
        setP2Poke(splitToken[3].split(",")[0]);
        setP2PokeHealth(splitToken[4].split("/")[0]);
        //set status on switch in
        if (splitToken[4].split(" ").length == 2)
          setP2PokeStatus((prevState) => [
            ...prevState,
            "status " + splitToken[4].split(" ")[1],
          ]);
      }

      //set the health display on damage and heal
      if (
        (token.startsWith("|-damage|") || token.startsWith("|-heal|")) &&
        token.split("|")[3] != "0 fnt"
      ) {
        if (
          (token.startsWith("|-damage|p1a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          token.startsWith("|-heal|p1a:") ||
          (token.startsWith("|-damage|p1a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100")
        ) {
          var splitToken = token.split("|");
          setP1PokeHealth(splitToken[3].split("/")[0]);
        }
        if (
          (token.startsWith("|-damage|p2a:") &&
            token.split("|")[3].split("/")[1] == "100") ||
          token.startsWith("|-heal|p2a:") ||
          (token.startsWith("|-damage|p2a:") &&
            token.split("|")[3].split("/")[1].split(" ")[0] == "100")
        ) {
          var splitToken = token.split("|");
          setP2PokeHealth(splitToken[3].split("/")[0]);
        }
      }
      //set health to 0 on faint
      if (token.startsWith("|faint|p1a:")) {
        setP1PokeHealth(0);
      }
      if (token.startsWith("|faint|p2a:")) {
        setP2PokeHealth(0);
      }

      //set status
      if (token.startsWith("|-status|p1a:")) {
        var splitToken = token.split("|");
        console.log("in stat");
        setP1PokeStatus((prevState) => [
          ...prevState,
          "status " + splitToken[3],
        ]);
      }
      if (token.startsWith("|-status|p2a:")) {
        var splitToken = token.split("|");
        setP2PokeStatus((prevState) => [
          ...prevState,
          "status " + splitToken[3],
        ]);
      }

      //cure status
      if (token.startsWith("|-curestatus|p1a:")) {
        var splitToken = token.split("|");
        const newStatuses = p1PokeStatus.filter(
          (status) => status != "status " + splitToken[3]
        );
        setP1PokeStatus(newStatuses);
      }
      if (token.startsWith("|-curestatus|p2a:")) {
        var splitToken = token.split("|");
        const newStatuses = p1PokeStatus.filter(
          (status) => status != "status " + splitToken[3]
        );
        setP2PokeStatus(newStatuses);
      }

      //set boost and unboost
      if (token.startsWith("|-unboost|p1a:")) {
        var splitToken = token.split("|");

        setP1PokeStatus((prevState) => [
          ...prevState,
          "unboost " + splitToken[3],
        ]);
      }
      if (token.startsWith("|-unboost|p2a:")) {
        var splitToken = token.split("|");

        setP2PokeStatus((prevState) => [
          ...prevState,
          "unboost " + splitToken[3],
        ]);
      }
      if (token.startsWith("|-boost|p1a:")) {
        var splitToken = token.split("|");

        setP1PokeStatus((prevState) => [
          ...prevState,
          "boost " + splitToken[3],
        ]);
      }
      if (token.startsWith("|-boost|p2a:")) {
        var splitToken = token.split("|");

        setP2PokeStatus((prevState) => [
          ...prevState,
          "boost " + splitToken[3],
        ]);
      }

      if (token.startsWith("|win")) {
        var splitToken = token.split("|");
        var winner = splitToken[2];
        setBattleEnd(true);
        if (id == winner.replace(/['"]+/g, "")) setRewards(1000, 2, true);
        else setRewards(0, 1, false);
      }
    } //end tok

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
          setTimeout(
            () =>
              enqueueSnackbar(`The weather stopped...`, {
                variant: "warning",
              }),
            delay
          );
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

    if (token.startsWith("|win")) {
      var splitToken = token.split("|");
      var winner = splitToken[2];
      setTimeout(
        () =>
          enqueueSnackbar(`${winner} won the battle!`, {
            variant: "info",
          }),
        delay
      );
      delay += addDelay;
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
            <StatusDisplay statuses={!player1 ? p1PokeStatus : p2PokeStatus} />
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
            <StatusDisplay statuses={player1 ? p1PokeStatus : p2PokeStatus} />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
