import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PokemonPiece from "./PokemonPiece";
import { Grid, Box, Typography } from "@mui/material";

const TeamWildArea = ({
  team,
  setTeam,
  candies,
  setCandies,
  setBag,
  setMoney,
  id,
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

    if (
      destination.droppableId == "box" &&
      source.droppableId == "team" &&
      team.length == 1
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
      <Grid container justifyContent="center" spacing={1}>
        <Grid item container justifyContent="center" xs={12}>
          <Grid
            item
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "2px",
              border: "solid",
              borderColor: "gray",
              borderWidth: "4px",
              minHeight: "60px",
              width: "254px",
              textAlign: "center",
              justifyContent: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#47a79f",
              boxShadow: "0px 5px gray",
            }}
          >
            {team ? (
              <Droppable droppableId="team" direction="horizontal">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      width: "100%",
                      display: "flex",
                      minHeight: "5vh",
                      textAlign: "center",
                    }}
                  >
                    {team.map((poke, index) => {
                      return (
                        <Draggable
                          key={poke.id}
                          draggableId={poke.id}
                          index={index}
                        >
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={index == 0 ? "firstmon" : ""}
                              sx={{ width: "68px", ml: "7px" }}
                            >
                              <PokemonPiece
                                poke={poke}
                                candies={candies}
                                setCandies={setCandies}
                                team={team}
                                setTeam={setTeam}
                                setBag={setBag}
                                setMoney={setMoney}
                                id={id}
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
          </Grid>
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

export default TeamWildArea;
