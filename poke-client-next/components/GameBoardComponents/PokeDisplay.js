import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PokemonPiece from "./PokemonPiece";
import { List, ListItem, Grid, Box, Typography, Divider } from "@mui/material";

const TeamDisplay = ({
  team,
  setTeam,
  box,
  setBox,
  candies,
  setCandies,
  setBag,
}) => {
  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId == "team" &&
      source.droppableId == "box" &&
      team.length == 3
    )
      return;

    const start = source.droppableId;
    const end = destination.droppableId;

    if (start == end) {
      const items = [];

      if (start == "team") items = Array.from(team);
      else items = Array.from(box);

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      if (start == "team") setTeam(items);
      else setBox(items);
    } else {
      var items = [];

      if (start == "team") items = Array.from(team);
      else items = Array.from(box);

      const [reorderedItem] = items.splice(result.source.index, 1);
      // items.splice(result.destination.index, 0, reorderedItem);

      if (start == "team") setTeam(items);
      else setBox(items);

      items = [];

      if (end == "team") items = Array.from(team);
      else items = Array.from(box);

      items.splice(result.destination.index, 0, reorderedItem);
      if (end == "team") setTeam(items);
      else setBox(items);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Grid container sx={{ mt: "1vh" }} spacing={1}>
        <Grid textAlign="center" item xs={2}>
          <Typography>Party</Typography>
          <Box
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "5px",
              border: "solid",
              borderWidth: "1px",
              minHeight: "15vh",
            }}
          >
            {team.length ? (
              <Droppable droppableId="team">
                {(provided) => (
                  <Box {...provided.droppableProps} ref={provided.innerRef}>
                    {team.map((poke, index) => {
                      return (
                        <Draggable
                          key={poke.species}
                          draggableId={poke.species}
                          index={index}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ width: "68px" }}
                            >
                              <PokemonPiece
                                poke={poke}
                                candies={candies}
                                setCandies={setCandies}
                                team={team}
                                setTeam={setTeam}
                                setBag={setBag}
                              />
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
        <Grid item textAlign="center" xs={10}>
          <Typography>Box</Typography>
          <Box
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "5px",
              border: "solid",
              borderWidth: "1px",
              minHeight: "15vh",
            }}
          >
            {box.length ? (
              <Droppable droppableId="box" direction="horizontal">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{ width: "100%", display: "flex" }}
                  >
                    {box.map((poke, index) => {
                      return (
                        <Draggable
                          key={poke.species}
                          draggableId={poke.species}
                          index={index}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{ width: "68px" }}
                            >
                              <PokemonPiece
                                poke={poke}
                                candies={candies}
                                setCandies={setCandies}
                                team={box}
                                setTeam={setBox}
                                setBag={setBag}
                              />
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
      </Grid>
    </DragDropContext>
  );
};

export default TeamDisplay;
