import { useState } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import "./mint.scss";

function Mint() {
  const dispatch = useDispatch();
  const [isMinting, setIsMinting] = useState(false);
  const { address, chainID, provider } = useWeb3Context();
  // const account = useSelector(state => state.account.genesisMint);
  const genesisData = useSelector(state => state.app.genesisMint);
  let genesisContract;

  return (
    <div className="mint-view">
      <Container maxWidth="xl">
        <Box m={1} p={1} style={{ width: "auto", textAlign: "left" }}>
          <Typography variant="h3" style={{ fontWeight: "600" }}>
            SΞASON 0: GΞNΞS1S
          </Typography>
          <Typography variant="h6">0 / 999</Typography>
        </Box>
        <Box m={1}>
          <Grid container spacing={3} className="grid-container">
            <Grid item lg={4} p={1} style={{ textAlign: "center" }}>
              <Paper className="ohm-card">
                <Typography variant="h5">Creation</Typography>
                <Box className="preview gif-1"></Box>
                <Box className="mint-data">
                  <Typography>-- Available</Typography>
                </Box>
              </Paper>
              <Button variant="contained" color="primary" disabled>
                Mint
              </Button>
            </Grid>

            <Grid item lg={4} p={1} style={{ textAlign: "center" }}>
              <Paper className="ohm-card">
                <Typography variant="h5">Abundance</Typography>
                <Box className="preview gif-2"></Box>
                <Box className="mint-data">
                  <Typography>-- Available</Typography>
                </Box>
              </Paper>
              <Button variant="contained" color="primary" disabled>
                Mint
              </Button>
            </Grid>

            <Grid item lg={4} p={1} style={{ textAlign: "center" }}>
              <Paper className="ohm-card">
                <Typography variant="h5">Flow</Typography>
                <Box className="preview gif-3"></Box>
                <Box className="mint-data">
                  <Typography>-- Available</Typography>
                </Box>
              </Paper>
              <Button variant="contained" color="primary" disabled>
                Mint
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default Mint;
