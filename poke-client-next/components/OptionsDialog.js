import React from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Slider,
  Stack,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeUp from "@mui/icons-material/VolumeUp";

const OptionsDialog = ({
  volume,
  handleChange,
  optionsMenuOpen,
  setOptionsMenuOpen,
}) => {
  return (
    <Box>
      <Dialog
        fullWidth
        maxWidth={"md"}
        open={optionsMenuOpen}
        onClose={(event, reason) => {
          setOptionsMenuOpen(false);
        }}
      >
        <Box sx={{ backgroundColor: "#fafafa" }}>
          <DialogTitle>Settings</DialogTitle>
          <DialogContent>
            {" "}
            <Stack
              spacing={2}
              direction="row"
              sx={{
                width: "100%",
                height: "5vh",
                top: "90%",
                left: "80%",
                mb: 1,
                borderRadius: "3px",
                border: "solid",
                borderWidth: "1px",
                borderColor: "gray",
                p: 1,
                boxShadow: 5,
              }}
              alignItems="center"
            >
              <VolumeDown />
              <Slider
                aria-label="Volume"
                value={volume}
                onChange={handleChange}
              />
              <VolumeUp />
            </Stack>
          </DialogContent>
        </Box>
      </Dialog>
    </Box>
  );
};

export default OptionsDialog;
