import React, { useState } from "react";
import "./Card.css";

function Card(props) {
  const [imageStatus, setStatus] = useState("loading");
  return (
    <div
      className={`card-holder ${imageStatus} ${
        imageStatus !== "loading" && props.revealed ? "revealed" : ""
      }`}
    >
      <img
        src={props.imageSrc}
        alt={props.alt}
        className={"w-100"}
        onLoad={() => {
          setStatus("loaded");
        }}
        onError={() => {
          setStatus("loading");
        }}
      />
    </div>
  );
}

export { Card };
