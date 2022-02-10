import styled from "styled-components";
import { Typography } from "@material-ui/core";

export const Title = styled(Typography)``;

export default ({ titleColor, background, children }) => (
  <Title
    variant="h3"
    style={{
      fontWeight: 600,
      background,
      color: "transparent",
      backgroundClip: "text",
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
    }}
    titleColor={titleColor}
  >
    {children}
  </Title>
);
