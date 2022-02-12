import React, { useEffect } from "react";
import { Typography, Dialog, DialogContent, Slide } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NextRoundDialog = ({ round, open, setOpen }) => {
  useEffect(() => {
    if (open) {
      setTimeout(() => setOpen(false), 1000);
    }
  }, [open]);

  return (
    <div>
      <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
      >
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="h1">Round {round + 1}</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NextRoundDialog;
