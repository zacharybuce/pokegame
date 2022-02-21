import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PokemonPiece from "./PokemonPiece";
import { Grid, Box, Typography } from "@mui/material";

const TeamDisplay = ({
  team,
  setTeam,
  box,
  setBox,
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
      <Grid container justifyContent="center" sx={{ mt: "1vh" }} spacing={1}>
        <Grid textAlign="center" item xs={2}>
          <Box sx={{ height: "50px" }}>
            <Typography sx={{ fontSize: "30px" }}>Party</Typography>
          </Box>
          <Grid
            item
            xs={12}
            sx={{
              mt: "1vh",
              p: 1,
              borderRadius: "2px",
              border: "solid",
              borderColor: "gray",
              borderWidth: "4px",
              minHeight: "177px",
              textAlign: "center",
              justifyContent: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#47a79f",
              boxShadow: "0px 5px gray",
            }}
          >
            {team ? (
              <Droppable droppableId="team">
                {(provided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    sx={{
                      minHeight: "204px",
                      width: "100%",
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
                              sx={{
                                width: "68px",
                                m: "auto",
                                mb: "5px",
                              }}
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
        <Grid item textAlign="center" xs={10}>
          <Box
            sx={{
              borderRadius: "5px",
              // border: "solid",
              // borderWidth: "1px",
              height: "50px",
              width: "50%",
              m: "auto",
              backgroundImage: "url(/BoxTop.png)",
              backgroundSize: "100% 50px",
              backgroundRepeat: "no-repeat",
              alignSelf: "center",
            }}
          >
            <Typography
              color="white"
              sx={{
                fontSize: "30px",
                textShadow: "2px 2px  #000000",
              }}
            >
              Box
            </Typography>
          </Box>
          <Box
            sx={{
              mt: "1vh",
              p: 2,
              borderRadius: "5px",
              // border: "solid",
              // borderWidth: "1px",
              height: "347px",
              width: "100%",
              backgroundImage: "url(/Box.png)",
              backgroundSize: "100% 347px",
              backgroundRepeat: "no-repeat",
              alignSelf: "center",
            }}
          >
            {box ? (
              <Droppable droppableId="box" direction="horizontal">
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
                    {box.map((poke, index) => {
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
                              sx={{ width: "68px", ml: "7px" }}
                            >
                              <PokemonPiece
                                poke={poke}
                                candies={candies}
                                setCandies={setCandies}
                                team={box}
                                setTeam={setBox}
                                setBag={setBag}
                                setMoney={setMoney}
                                id={id}
                                inBox
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
