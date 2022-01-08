import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PokeInfoMove = ({ move }) => {
  const [moveInfo, setMoveInfo] = useState(null);

  const getMoveInfo = async () => {
    const res = await fetch(
      "http://localhost:3000/api/moves/" + move.toLowerCase().replace(/\s/g, "")
    );
    const data = await res.json();
    setMoveInfo(data.data);
  };

  useEffect(() => {
    getMoveInfo();
  }, [move]);

  const typeColor = (type) => {
    switch (type) {
      case "Normal":
        return "#A8A77A";
      case "Fire":
        return "#EE8130";
      case "Water":
        return "#6390F0";
      case "Electric":
        return "#F7D02C";
      case "Grass":
        return "#7AC74C";
      case "Ice":
        return "#96D9D6";
      case "Fighting":
        return "#C22E28";
      case "Poison":
        return "#A33EA1";
      case "Ground":
        return "#E2BF65";
      case "Flying":
        return "#A98FF3";
      case "Psychic":
        return "#F95587";
      case "Bug":
        return "#A6B91A";
      case "Rock":
        return "#B6A136";
      case "Ghost":
        return "#735797";
      case "Dragon":
        return "#6F35FC";
      case "Dark":
        return "#705746";
      case "Steel":
        return "#B7B7CE";
      case "Fairy":
        return "#D685AD";
    }
  };

  if (moveInfo)
    return (
      <Accordion
        sx={{ backgroundColor: typeColor(moveInfo.type), color: "#fafafa" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{move}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ color: "fafafa" }}>
          <Grid container>
            <Grid item xs={6}>
              <Typography>
                <b>Type:</b> {JSON.stringify(moveInfo.type)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Accuracy:</b> {JSON.stringify(moveInfo.accuracy)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Base Power:</b> {JSON.stringify(moveInfo.basePower)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <b>Category: </b>
                {JSON.stringify(moveInfo.category)}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <b>Desc:</b> {JSON.stringify(moveInfo.shortDesc)}
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );

  return <div></div>;
};

export default PokeInfoMove;
