import React from "react";

const PokeIcon = ({ name, shiny }) => {
  return (
    <span
      className={
        "pokesprite pokemon " + name.toLowerCase() + (shiny ? " shiny" : "")
      }
    ></span>
  );
};

export default PokeIcon;
