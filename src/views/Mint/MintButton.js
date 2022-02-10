import { Box, Button } from "@material-ui/core";

export const MintButton = ({ isDisabled, handleMint }) => {
  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={isDisabled()}
        onClick={() => handleMint(3)}
        style={{ fontWeight: "600" }}
      >
        Mint
      </Button>
    </Box>
  );
};
