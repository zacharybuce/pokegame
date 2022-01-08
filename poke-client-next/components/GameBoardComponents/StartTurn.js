import { Button } from "@mui/material";
import React from "react";

const StartTurn = ({ startTurn }) => {
  return (
    <Button onClick={() => startTurn()} fullWidth variant="contained">
      Start Turn
    </Button>
  );
};

export default StartTurn;
