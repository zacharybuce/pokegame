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
  const handleChange = (event) => {
    setStarter(event.target.value);
  };

  const handleSubmit = () => {
    socket.emit("send-rules-update", starter, "Kanto-Johto");
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
                  <InputLabel id="demo-simple-select-label">
                    Starters
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={starter}
                    label="Starters"
                    onChange={handleChange}
                  >
                    <MenuItem value={"Classic"}>Classic</MenuItem>
                    <MenuItem value={"Random"}>Random</MenuItem>
                    <MenuItem value={"Random Fair"}>Random Fair</MenuItem>
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
