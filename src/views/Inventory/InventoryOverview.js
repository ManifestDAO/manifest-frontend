import { Box, Typography } from "@material-ui/core";

export const InventoryOverview = ({ accountData, accountBalances }) => {
  return (
    <Box p={1} display="flex" flexDirect="row" justifyContent="space-between" style={{ width: "auto" }}>
      <Box style={{ width: "50%", textAlign: "left" }}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          Inventory
        </Typography>
        <Box marginTop="10px">
          <Typography variant="h6">Select an Size your NFT before you Claim</Typography>
          <Typography variant="h6">Once you Claim you cannot unclaim</Typography>
          <Typography variant="h6">You may Claim and Order multiple items</Typography>
        </Box>
      </Box>
      <Box style={{ width: "50%", textAlign: "right", fontWeight: "500 !important" }}></Box>
    </Box>
  );
};

export default InventoryOverview;
