import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Typography, Box, Grid } from "@mui/material";
import PokemonPiece from "./PokemonPiece";
import ItemBag from "./ItemBag";
import PlayerDisplay from "./PlayerDisplay";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PokeDisplayMobile = ({
  team,
  setTeam,
  box,
  setBox,
  candies,
  setCandies,
  setBag,
  setMoney,
  id,
  items,
  setItems,
  lobby,
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Pokemon" {...a11yProps(0)} />
          <Tab label="Items" {...a11yProps(1)} />
          <Tab label="Players" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Grid container justifyContent="center" spacing={1} direction="column">
          <Grid textAlign="center" item xs={12}>
            <Box>
              <Typography>Party</Typography>
            </Box>
            <Grid
              item
              container
              sx={{
                mt: "1vh",
                p: 1,
                borderRadius: "2px",
                border: "solid",
                borderColor: "gray",
                borderWidth: "4px",
                minHeight: "88px",
                textAlign: "center",
                justifyContent: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#47a79f",
                boxShadow: "0px 5px gray",
              }}
            >
              {team.map((poke, index) => {
                return (
                  <Box
                    sx={{
                      width: "68px",
                      m: "auto",
                      //mb: "5px",
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
                      otherSet={setBox}
                      isTeam={true}
                    />
                  </Box>
                );
              })}
            </Grid>
          </Grid>
          <Grid textAlign="center" item xs={12}>
            <Box>
              <Typography>Box</Typography>
            </Box>
            <Grid
              item
              container
              sx={{
                mt: "1vh",
                p: 1,
                borderRadius: "2px",
                border: "solid",
                borderColor: "gray",
                borderWidth: "4px",
                minHeight: "88px",
                textAlign: "center",
                justifyContent: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#98c860",
                boxShadow: "0px 5px gray",
              }}
            >
              {box.map((poke, index) => {
                return (
                  <Box
                    sx={{
                      width: "68px",
                      m: "auto",
                    }}
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
                      otherSet={setTeam}
                      isTeam={false}
                      teamAmount={team.length}
                    />
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ height: "248px", overflowY: "scroll" }}>
          <ItemBag
            items={items}
            team={team}
            setTeam={setTeam}
            setItems={setItems}
            setMoney={setMoney}
          />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ height: "248px", overflowY: "scroll" }}>
          <PlayerDisplay lobby={lobby} />
        </Box>
      </TabPanel>
    </Box>
  );
};

export default PokeDisplayMobile;
