import React from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Tooltip,
} from "@mui/material";
import EditMoves from "./EditMoves";

const EditMovesDialog = ({ editing, setEditing, poke, handleSubmit }) => {
  return (
    <Dialog
      maxWidth={"md"}
      open={editing}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          setEditing(false);
        }
      }}
    >
      <Box sx={{ backgroundColor: "#fafafa" }}>
        <DialogTitle>Edit Moves</DialogTitle>
        <DialogContent>
          <EditMoves
            currentMoves={poke.moves}
            learnMoves={poke.newMoves}
            setEditing={setEditing}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EditMovesDialog;
