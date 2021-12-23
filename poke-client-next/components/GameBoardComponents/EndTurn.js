import { Button, Grid } from "@mui/material";
import React from "react";

const EndTurn = ({ endTurn }) => {
  return (
    <Button onClick={() => endTurn()} color="error" variant="contained">
      End Turn
    </Button>
  );
};

export default EndTurn;
