import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  List,
  ListItem,
  Grid,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import PokeInfoMove from "./PokeInfoMove";

const EditMoves = ({ currentMoves, learnMoves, setEditing, handleSubmit }) => {
  const [moves, setMoves] = useState(currentMoves);
  const [newMoves, setNewMoves] = useState(learnMoves);

  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId == "moves" &&
      source.droppableId == "newMoves" &&
      moves.length == 4
    )
      return;

    const start = source.droppableId;
    const end = destination.droppableId;

    if (start == end) {
      const items = [];

      if (start == "moves") items = Array.from(moves);
      else items = Array.from(newMoves);

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      if (start == "moves") setMoves(items);
      else setNewMoves(items);
    } else {
      var items = [];

      if (start == "moves") items = Array.from(moves);
      else items = Array.from(newMoves);

      const [reorderedItem] = items.splice(result.source.index, 1);
      // items.splice(result.destination.index, 0, reorderedItem);

      if (start == "moves") setMoves(items);
      else setNewMoves(items);

      items = [];

      if (end == "moves") items = Array.from(moves);
      else items = Array.from(newMoves);

      items.splice(result.destination.index, 0, reorderedItem);
      if (end == "moves") setMoves(items);
      else setNewMoves(items);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Grid container sx={{ mt: "1vh" }} spacing={1}>
        <Grid item xs={6}>
          <Typography variant="h5">Current Moves</Typography>
          <Box
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "5px",
              border: "solid",
              borderWidth: "1px",
            }}
          >
            {moves.length ? (
              <Droppable droppableId="moves">
                {(provided) => (
                  <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {moves.map((move, index) => {
                      return (
                        <Draggable key={move} draggableId={move} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: "1vh" }}
                            >
                              <PokeInfoMove move={move} />
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ) : (
              <div></div>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5">Learnable Moves</Typography>
          <Box
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "5px",
              border: "solid",
              borderWidth: "1px",
            }}
          >
            {newMoves.length ? (
              <Droppable droppableId="newMoves">
                {(provided) => (
                  <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {newMoves.map((move, index) => {
                      return (
                        <Draggable key={move} draggableId={move} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ mb: "1vh" }}
                            >
                              <PokeInfoMove move={move} />
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            ) : (
              <div></div>
            )}
          </Box>
        </Grid>
        <Grid item xs={6} sx={{ mt: "3vh", textAlign: "center" }}>
          {moves.length < 4 ? (
            <Typography>Can't have less than 4 moves</Typography>
          ) : (
            <div></div>
          )}
          <Button
            onClick={() => handleSubmit(moves, newMoves)}
            variant="contained"
            sx={{ width: "75%" }}
            disabled={moves.length < 4}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={6} sx={{ mt: "3vh", textAlign: "center" }}>
          <Button
            onClick={() => setEditing(false)}
            fullWidth
            variant="contained"
            color="error"
            sx={{ width: "75%" }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default EditMoves;
