import { Box, Typography } from "@material-ui/core";
import styled from "styled-components";

export const Preview = styled(Box)`
  margin-top: 10px;
  width: 100%;
  min-width: 200px;
  display: flex;
  min-height: 220px;
  max-height: 220px;
  height: auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position-x: center;
  background-image: url(${props => props.background});
`;

export default ({ nftTitle, background, children }) => {
  console.log(nftTitle);

  return (
    <>
      <Typography variant="h5">{nftTitle}</Typography>
      <Preview background={background}>{children}</Preview>
    </>
  );
};

/* <Box className="preview gif-3"></Box>; */
