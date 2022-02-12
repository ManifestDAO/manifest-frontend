import { Box, Button } from "@material-ui/core";

export const MintButton = ({ disabled, handleMint, children = "Mint" }) => {
  console.log(children);
  return (
    <Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        disabled={disabled}
        onClick={handleMint}
        style={{ fontWeight: "600" }}
      >
        {children}
      </Button>
    </Box>
  );
};
