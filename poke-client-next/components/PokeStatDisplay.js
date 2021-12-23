import React, { useEffect } from "react";
import { Grid, LinearProgress, Typography, Box } from "@mui/material";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const PokeStatDisplay = ({ health, name }) => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item xs={12}>
        <LinearProgressWithLabel value={health} />
      </Grid>
    </Grid>
  );
};

export default PokeStatDisplay;
