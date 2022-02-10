import { useState, useEffect } from "react";

import { Container, Divider } from "@material-ui/core";
import GenesisMint from "./GenesisMint";
import KlimaMint from "./KlimaMint";
import "./mint.scss";
import styled from "styled-components";

const MintView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 333px;
`;

function Mint() {
  return (
    <MintView>
      <Container maxWidth="md">
        <KlimaMint />
        <Divider style={{ marginBottom: "33px" }} />
        <GenesisMint />
      </Container>
    </MintView>
  );
}

export default Mint;
