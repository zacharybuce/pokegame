import React from "react";
import { Dialog, Box } from "@mui/material";
import Starter from "./Starter";
import Board from "../Board";
import WildBattle from "./WildBattle";

const RoundDialog = ({
  roundOpen,
  setRoundOpen,
  round,
  setTeam,
  setBox,
  setRoundDone,
  setMoney,
  setBalls,
  setCandies,
  balls,
  activeStep,
  id,
  setBattleMusic,
  team,
  candies,
  setBag,
}) => {
  const handleClose = () => {
    setRoundOpen(false);
    setRoundDone(true);
  };

  const display = () => {
    switch (round) {
      case "starter":
        return <Starter setTeam={setTeam} handleClose={handleClose} />;
      case "trainer":
        return (
          <Box sx={{ p: 3 }}>
            <Board
              id={id}
              handleClose={handleClose}
              setMoney={setMoney}
              setCandies={setCandies}
              rarity={"player"}
              setBattleMusic={setBattleMusic}
            />
          </Box>
        );
      case "wild":
        return (
          <WildBattle
            id={id}
            balls={balls}
            setBalls={setBalls}
            setCandies={setCandies}
            setMoney={setMoney}
            setBox={setBox}
            handleClose={handleClose}
            round={activeStep}
            setTeam={setTeam}
            team={team}
            candies={candies}
            setBag={setBag}
          />
        );
    }
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={"md"}
      open={roundOpen}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
    >
      {display()}
    </Dialog>
  );
};

export default RoundDialog;
