import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  Divider,
  Typography,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import CookieIcon from "@mui/icons-material/Cookie";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

const GameFinishDialog = ({ finishDialogOpen, setFinishDialogOpen, lobby }) => {
  const [standing, setStanding] = useState([]);

  const handleClose = () => {
    setFinishDialogOpen(false);
  };

  const findWinner = () => {
    let winner = lobby.players[0];
    for (let i = 0; i < lobby.players.length; i++) {
      if (winner.score < lobby.players[i]) winner = lobby.player[i];
    }
    return winner.name.replace(/['"]+/g, "");
  };

  const findStanding = (a, b) => {
    if (a.score > b.score) return -1;
    if (b.score > a.score) return 1;
    if (a.score == b.score) {
      if (a.playerBattlesWon > b.playerBattlesWon) return -1;
      if (b.playerBattlesWon > a.playerBattlesWon) return 1;
      if (a.npcBattlesWon > b.npcBattlesWon) return -1;
      if (a.npcBattlesWon < b.npcBattlesWon) return 1;
    }
  };

  const place = (index) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
    }
  };

  useEffect(() => {
    let sortLobby = lobby.players.sort(findStanding);
    console.log(sortLobby);
    setStanding(sortLobby);
  }, [lobby]);

  if (lobby.players.length)
    return (
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={finishDialogOpen}
        onClose={() => handleClose()}
      >
        <Box sx={{ backgroundColor: "#fafafa" }}>
          <DialogTitle></DialogTitle>
          <DialogContent>
            <Typography variant="h2" sx={{ textAlign: "center" }}>
              🎉 The Winner is {findWinner()}! 🎉
            </Typography>
            <Divider />
            <Grid container sx={{ p: 5 }}>
              <Grid item xs={1}>
                <Typography variant="h6" color="gray"></Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h6" color="gray">
                  Player
                </Typography>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                  Score
                </Typography>
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                  <Tooltip title="Total Pokemon Caught">
                    <CatchingPokemonIcon />
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                  <Tooltip title="Total Candies Used">
                    <CookieIcon />
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                  <Tooltip title="NPC Battles Won">
                    <EmojiPeopleIcon />
                  </Tooltip>
                </Typography>
              </Grid>
              <Grid item xs={1} sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="gray">
                  <Tooltip title="Player Battles Won">
                    <EmojiEventsIcon />
                  </Tooltip>
                </Typography>
              </Grid>
              {standing.map((player, index) => {
                return (
                  <Grid item container xs={12} sx={{ pt: 1, pb: 1 }}>
                    <Grid item xs={1}>
                      <Typography variant="h5">{place(index)}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="h5">
                        {player.name.replace(/['"]+/g, "")}
                      </Typography>
                    </Grid>
                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">{player.score}</Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">{player.monCaught}</Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">
                        {player.candiesSpent}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">
                        {player.npcBattlesWon}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "center" }}>
                      <Typography variant="h5">
                        {player.playerBattlesWon}
                      </Typography>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    );

  return <div></div>;
};

export default GameFinishDialog;
