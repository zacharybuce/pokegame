import React from "react";

const ItemIcon = ({ name }) => {
  return (
    <div>
      <img
        src={
          "https://play.pokemonshowdown.com/sprites/itemicons/" + name + ".png"
        }
      />
    </div>
  );
};

export default ItemIcon;
