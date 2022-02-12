import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSocket } from "../contexts/SocketProvider";

const GameRulesDialog = ({ open, setOpen }) => {
  const socket = useSocket();
  const [starter, setStarter] = useState();
  const [wildArea, setWildArea] = useState();

  const handleChangeStarter = (event) => {
    setStarter(event.target.value);
  };
  const handleChangeArea = (event) => {
    setWildArea(event.target.value);
  };

  const handleSubmit = () => {
    socket.emit("send-rules-update", starter, "Kanto-Johto", wildArea);
    setOpen(false);
  };

  return (
    <Box>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
      >
        <Box sx={{ backgroundColor: "#fafafa" }}>
          <DialogTitle>Game Rules</DialogTitle>
          <DialogContent>
            <Grid container sx={{ textAlign: "center" }}>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: "1vh" }}>
                  <InputLabel id="Starter">Starters</InputLabel>
                  <Select
                    value={starter}
                    label="Starters"
                    onChange={handleChangeStarter}
                  >
                    <MenuItem value={"Classic"}>Classic</MenuItem>
                    <MenuItem value={"Random"}>Random</MenuItem>
                    <MenuItem value={"Random Fair"}>Random Fair</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mt: "1vh" }}>
                  <InputLabel id="Wild Area">Wild Area</InputLabel>
                  <Select
                    value={wildArea}
                    label="Wild Areas"
                    onChange={handleChangeArea}
                  >
                    <MenuItem value={"Classic"}>Classic</MenuItem>
                    <MenuItem value={"Random"}>Random</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={() => handleSubmit()}
                  sx={{ mt: "1vh", width: "75%" }}
                  variant="contained"
                  fullWidth
                  disabled={!starter}
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={() => setOpen(false)}
                  sx={{ mt: "1vh", width: "75%" }}
                  variant="contained"
                  color="error"
                  fullWidth
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default GameRulesDialog;
