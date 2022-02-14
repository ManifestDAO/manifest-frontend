import styled from "styled-components";
import { Typography } from "@material-ui/core";

export const GenesisTitle = styled(Typography)`
  background: linear-gradient(to right, #aa11ee, #9f11ef);
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default ({ children }) => (
  <GenesisTitle variant="h3" style={{ fontWeight: 600 }}>
    {children}
  </GenesisTitle>
);
