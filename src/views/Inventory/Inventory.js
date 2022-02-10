import { useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";

function Inventory() {
  const klimaData = useSelector(state => state.app.klimaMint);
  const accountData = useSelector(state => state.account.klima);
  const accountBalances = useSelector(state => state.account.balances);

  const [size, setSize] = useState("");
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <div className="mint-view">
      <Container maxWidth="md">
        <Box style={{ marginBottom: "33px" }}>
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

            <Box style={{ width: "50%", textAlign: "right", fontWeight: "500 !important" }}>
              <Typography variant="h6" className={accountData.saleEligible ? "wallet-eligible" : ""}>
                {accountData.saleEligible ? (
                  <CheckIcon
                    viewBox="0 0 24 24"
                    style={{ height: "11px", width: "11px", marginRight: "3px", color: "green" }}
                  />
                ) : (
                  <NotInterestedIcon
                    viewBox="0 0 24 24"
                    style={{ height: "11px", width: "11px", marginRight: "3px", color: "red" }}
                  />
                )}
                {accountData.saleEligible ? "Wallet Eligible" : "Wallet Ineligible"}
              </Typography>
              <Typography variant="h6">Youve ordered: {accountData.totalClaimed}</Typography>
              <Typography variant="h6">MNFST Balance: {Number(accountBalances.mnfst).toFixed(2)}</Typography>
              <Typography variant="h6">sMNFST Balance: {Number(accountBalances.smnfst).toFixed(2)}</Typography>
            </Box>
          </Box>

          <Box style={{ marginTop: "15px" }} p={1}>
            <Grid container spacing={3} className="grid-container">
              <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
                <Zoom in={true}>
                  <Paper
                    className="ohm-card"
                    onClick={e => {
                      console.log(selected);
                      setSelected(e.target);
                    }}
                  >
                    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                      <Box>
                        <Typography variant="h5">Cooperation</Typography>
                        <Box className="preview klima-gif-1"></Box>
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              </Grid>
            </Grid>
          </Box>
          <Button className="stake-button" variant="contained" color="primary">
            {`Claim (${amount})`}
          </Button>
        </Box>
      </Container>
    </div>
  );
}

export default Inventory;
