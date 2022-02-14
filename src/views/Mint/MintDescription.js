import { Box, Typography } from "@material-ui/core";

export const MintDescription = ({ itemsRemaining, itemsClaimed }) => {
  return (
    <Box m={1}>
      {itemsRemaining > 0 ? (
        <Typography variant="h6">{itemsRemaining} Available</Typography>
      ) : (
        <Typography variant="h6">Sold Out</Typography>
      )}
      <Typography>Youve minted: {itemsClaimed}</Typography>
    </Box>
  );
};
