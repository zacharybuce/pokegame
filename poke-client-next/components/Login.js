import React, { useState } from "react";
import { Box, TextField, Button, Grid } from "@mui/material";

const Login = ({ setId }) => {
  const [field, setField] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    setId(field);
  };

  return (
    <Box
      onSubmit={handleSubmit}
      component="form"
      noValidate
      autoComplete="off"
      sx={{ textAlign: "center" }}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            onChange={(e) => setField(e.target.value)}
            id="outlined-basic"
            label="id"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
