import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  SvgIcon,
  Switch,
  Tab,
  Tabs,
  Typography,
  Zoom,
  withStyles,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

export const InventoryOverview = ({ accountData, accountBalances }) => {
  return (
    <Box p={1} display="flex" flexDirect="row" justifyContent="space-between" style={{ width: "auto" }}>
      <Box style={{ width: "50%", textAlign: "left" }}>
        <Typography variant="h3" style={{ fontWeight: "600" }} className="title klima-title">
          Inventory
        </Typography>
        <Box marginTop="10px">
          <Typography variant="h6">Claim and Order from Inventory</Typography>
          <Typography variant="h6">Once you Claim you cannot unclaim</Typography>
          <Typography variant="h6">You may Claim and Order multiple items</Typography>
        </Box>
      </Box>
      <Box style={{ width: "50%", textAlign: "right", fontWeight: "500 !important" }}></Box>
    </Box>
  );
};

export default InventoryOverview;
