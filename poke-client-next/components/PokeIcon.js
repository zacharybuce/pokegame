import React, { useState, useEffect } from "react";

const PokeIcon = ({ name }) => {
  const [id, setId] = useState(null);

  useEffect(() => {
    getId();
  }, [name]);
  const getId = async () => {
    const res = await fetch(
      "http://localhost:3000/api/pokemon/" +
        name.toLowerCase().replace(/\s/g, "")
    );
    const data = await res.json();
    setId(data.data.num);
  };

  if (id)
    return (
      <img src={"https://veekun.com/dex/media/pokemon/icons/" + id + ".png"} />
    );

  return <div></div>;
};

export default PokeIcon;