import React from "react";
import { Tooltip, Box, Stepper, Step, StepLabel } from "@mui/material";

const steps = [
  "Select Starter",
  "Wild Battle",
  "Wild Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Wild Battle",
  "Wild Battle",
  "Trainer Battle",
  "Wild Battle",
  "Wild Battle",
  "Wild Battle",
  "Trainer Battle",
];

export default function HorizontalLinearStepper({ activeStep }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Tooltip title={label}>
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}></StepLabel>
              </Step>
            </Tooltip>
          );
        })}
      </Stepper>
    </Box>
  );
}
