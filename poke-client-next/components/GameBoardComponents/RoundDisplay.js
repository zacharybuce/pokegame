import React from "react";
import { Tooltip, Box, Stepper, Step, StepLabel, Stack } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const steps = [
  "Select Starter",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Player Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Player Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Player Battle",
];

const display = (round) => {
  switch (round) {
    case "Player Battle":
      return <EmojiEventsIcon />;
  }
};

export default function HorizontalLinearStepper({ activeStep }) {
  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Tooltip title={label}>
              <Step key={label} {...stepProps} sx={{}}>
                <StepLabel {...labelProps}>{display(label)}</StepLabel>
              </Step>
            </Tooltip>
          );
        })}
      </Stepper>
    </Box>
  );
}
