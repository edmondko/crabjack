import React from 'react';

const cardBgImage = require("./card_back_bg.svg");

function CardBackground() {
    return <img className="w-100" src={cardBgImage} alt={"Card placeholder"} />;
}

export default CardBackground;