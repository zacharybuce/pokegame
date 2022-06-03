import React, { useEffect, useState } from "react";
import { useSocket } from "../../contexts/SocketProvider";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import PokeTradeIcon from "./PokeTradeIcon";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

const TradeDialog = ({
  p1,
  p2,
  isP1,
  dialogOpen,
  setDialogOpen,
  team,
  box,
  setTeam,
  setBox,
  setTradeInfo,
}) => {
  const socket = useSocket();
  const [playerOffer, setPlayerOffer] = useState("");
  const [oppPlayerOffer, setOppPlayerOffer] = useState("");
  const [playerAccept, setPlayerAccept] = useState(false);
  const [oppPlayerAccept, setOppPlayerAccept] = useState(false);

  useEffect(() => {
    if (socket === undefined) return;
    socket.on(
      "trade-update",
      (
        player1Offer,
        player2Offer,
        player1Accept,
        player2Accept,
        tradingEnd,
        tradingSuccess
      ) => {
        console.log(player1Offer);
        console.log(player2Offer);
        console.log("p1 " + player1Accept);
        console.log("p2 " + player2Accept);
        console.log("trade success " + tradingSuccess);

        updateTrade(
          player1Offer,
          player2Offer,
          player1Accept,
          player2Accept,
          tradingEnd,
          tradingSuccess
        );
      }
    );

    return () => socket.off("trade-update");
  }, [socket]);

  const tradeOffer = (poke) => {
    setPlayerOffer(poke);
    socket.emit("new-trade-offer", poke);
  };

  const acceptTradeOffer = (accept) => {
    setPlayerAccept(true);
    socket.emit("trade-offer-accept", accept);
  };

  const endTrade = () => {
    socket.emit("end-trade");
    setTradeInfo([]);
    setDialogOpen(false);
  };

  const successfulTrade = (playerOffer, oppPlayerOffer) => {
    let inTeam = false;
    var newTeam = team;

    console.log(newTeam);
    console.log(playerOffer);

    for (let i = 0; i < newTeam.length; i++) {
      if (JSON.stringify(newTeam[i]) == JSON.stringify(playerOffer)) {
        newTeam[i] = oppPlayerOffer;
        inTeam = true;
        setTeam([...newTeam]);
        console.log("Trade success");
        break;
      }
    }

    if (!inTeam) {
      var newBox = box;

      for (let i = 0; i < newBox.length; i++) {
        if (JSON.stringify(newBox[i]) == JSON.stringify(playerOffer)) {
          newBox[i] = oppPlayerOffer;
          setBox([...newBox]);
          console.log("Trade success");
          break;
        }
      }
    }

    setDialogOpen(false);
  };

  const displayOffer = (poke) => {
    if (isP1 == null) return <div></div>;

    let url = poke.shiny ? "ani-shiny/" : "ani/";
    return (
      <img
        src={
          "http://play.pokemonshowdown.com/sprites/" +
          url +
          poke.species.toLowerCase() +
          ".gif"
        }
        alt={poke.species}
      />
    );
  };

  const updateTrade = (
    player1Offer,
    player2Offer,
    player1Accept,
    player2Accept,
    tradingEnd,
    tradingSuccess
  ) => {
    console.log("isP1 = " + isP1);
    if (isP1 == true) {
      console.log("Changing for p1");
      //setPlayerOffer(player1Offer);
      setPlayerAccept(player1Accept);
      setOppPlayerOffer(player2Offer);
      setOppPlayerAccept(player2Accept);
    } else {
      console.log("Changing for p2");
      //setPlayerOffer(player2Offer);
      setPlayerAccept(player2Accept);
      setOppPlayerOffer(player1Offer);
      setOppPlayerAccept(player1Accept);
    }

    if (tradingEnd) {
      setTradeInfo([]);
      setDialogOpen(false);
    }

    if (tradingSuccess) {
      if (isP1) successfulTrade(player1Offer, player2Offer);
      else successfulTrade(player2Offer, player1Offer);
      setTradeInfo([]);
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={dialogOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          setDialogOpen(false);
        }
      }}
    >
      <Box sx={{ backgroundColor: "#fafafa" }}>
        <DialogContent sx={{ overflow: "hidden" }}>
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Trade bewtween {p1} and {p2}
          </Typography>
          <Grid container spacing={1} sx={{ mt: "2vh" }}>
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "167px",
                  border: "solid",
                  borderColor: "gray",
                  borderWidth: "3px",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0px 5px gray",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#f0c870",
                    textAlign: "center",
                  }}
                >
                  Your Offer
                </Box>
                <Grid
                  container
                  alignItems="end"
                  direction="row"
                  sx={{ textAlign: "center", height: "140px" }}
                >
                  <Grid item xs={12}>
                    {playerOffer ? displayOffer(playerOffer) : <div></div>}
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  mt: "3vh",
                  border: "solid",
                  borderRadius: 2,
                  borderWidth: "1px",
                  borderColor: "gray",
                }}
              >
                {playerAccept ? (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    Accepted
                    <CheckCircleOutlineIcon
                      sx={{ color: "green", position: "relative", top: "5px" }}
                    />
                  </Typography>
                ) : (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    Not Accepted...
                    <HourglassEmptyIcon
                      sx={{ color: "red", position: "relative", top: "5px" }}
                    />
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  height: "167px",
                  border: "solid",
                  borderColor: "gray",
                  borderWidth: "3px",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0px 5px gray",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#f0c870",
                    textAlign: "center",
                  }}
                >
                  Opp.'s Offer
                </Box>
                <Grid
                  container
                  alignItems="end"
                  direction="row"
                  sx={{ textAlign: "center", height: "140px" }}
                >
                  <Grid item xs={12}>
                    {oppPlayerOffer ? (
                      displayOffer(oppPlayerOffer)
                    ) : (
                      <div></div>
                    )}
                  </Grid>
                </Grid>
              </Box>
              <Box
                sx={{
                  mt: "3vh",
                  border: "solid",
                  borderRadius: 2,
                  borderWidth: "1px",
                  borderColor: "gray",
                }}
              >
                {oppPlayerAccept ? (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    Accepted
                    <CheckCircleOutlineIcon
                      sx={{ color: "green", position: "relative", top: "5px" }}
                    />
                  </Typography>
                ) : (
                  <Typography variant="h6" sx={{ textAlign: "center" }}>
                    Not Accepted...
                    <HourglassEmptyIcon
                      sx={{ color: "red", position: "relative", top: "5px" }}
                    />
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center", mt: "1vh" }}>
              <Typography variant="h5">Your Pokemon</Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              xs={12}
              sx={{
                mt: "1vh",
                border: "solid",
                borderColor: "gray",
                borderWidth: "3px",
                borderRadius: 2,
                boxShadow: "0px 5px gray",
                mb: "3vh",
                overflowX: "scroll",
              }}
            >
              {team.map((poke) => (
                <Grid item xs={3} md={1}>
                  <PokeTradeIcon poke={poke} tradeOffer={tradeOffer} />
                </Grid>
              ))}
              {box.map((poke) => (
                <Grid item xs={3} md={1}>
                  <PokeTradeIcon poke={poke} tradeOffer={tradeOffer} />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              {playerAccept ? (
                <Alert severity="success" sx={{ width: "75%" }}>
                  Accepted! Waiting for other player...
                </Alert>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  sx={{ width: "75%" }}
                  onClick={() => acceptTradeOffer(true)}
                >
                  Accept
                </Button>
              )}
            </Grid>
            <Grid item xs={6} sx={{ textAlign: "center" }}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                sx={{ width: "75%" }}
                onClick={() => endTrade()}
              >
                End Trade
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default TradeDialog;
