import { useState, useEffect } from "react";

import { Container } from "@material-ui/core";
import GenesisMint from "./GenesisMint";
import KlimaMint from "./KlimaMint";
import "./mint.scss";

function Mint() {
  return (
    <div className="mint-view">
      <Container maxWidth="md">
        <KlimaMint />
        <GenesisMint />
      </Container>
    </div>
  );
}

export default Mint;
