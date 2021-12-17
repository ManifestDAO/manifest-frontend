import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Button, Grid, Paper, Typography, Zoom } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import { loadAppDetails } from "src/slices/AppSlice";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import { abi as Genesis1155Abi } from "src/abi/Genesis1155.json";
import CheckIcon from "@material-ui/icons/Check";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import "./mint.scss";

function GenesisMint() {
  const dispatch = useDispatch();
  const [isMinting, setIsMinting] = useState(false);
  const { provider } = useWeb3Context();
  const accountData = useSelector(state => state.account.genesis);
  const genesisData = useSelector(state => state.app.genesisMint);
  let genesisContract;

  const pendingTransaction = useSelector(state => {
    return state.pendingTransactions;
  });

  const isDisabled = () => {
    return (
      pendingTransaction.length > 0 ||
      Number(accountData.totalClaimed) >= 3 ||
      !accountData.saleEligible ||
      !genesisData.saleStarted
    );
  };

  useEffect(() => {
    if (genesisData.contractAddress)
      genesisContract = new ethers.Contract(genesisData.contractAddress, Genesis1155Abi, provider.getSigner());
  }, [accountData, genesisData, isMinting]);

  function handleMint(id) {
    setIsMinting(true);
    mint(id);
  }

  const mint = async id => {
    let mintTx;
    // let curGas = await provider.getGasPrice();
    try {
      let ethAmt = ethers.utils.parseEther(genesisData.price);
      mintTx = await genesisContract.mint(id, { value: ethAmt, gasLimit: 250000 });

      dispatch(fetchPendingTxns({ txnHash: mintTx.hash, text: "Minting", type: "mint" }));
      await mintTx.wait();

      clearPendingTxn(mintTx);
    } catch (e) {
      let errorMessage = e.message;
      dispatch(error(errorMessage));
    } finally {
      dispatch(loadAppDetails);
      dispatch(loadAccountDetails);
      setIsMinting(false);
      if (mintTx) dispatch(clearPendingTxn(mintTx.hash));
    }
  };

  return (
    <Box style={{ marginBottom: "33px" }}>
      <Box p={1} display="flex" flexDirect="row" justifyContent="space-between" style={{ width: "auto" }}>
        <Box style={{ width: "50%", textAlign: "left" }}>
          <Typography variant="h3" style={{ fontWeight: "600" }} className="title genesis-title">
            SΞASON 0: GΞNΞS1S
          </Typography>
          <Box marginTop="10px">
            {genesisData && (
              <Typography variant="h6">
                {genesisData.totalMinted} / {genesisData.totalSupply} Minted
              </Typography>
            )}
            <Typography variant="h6">0.333 ETH</Typography>
            <Typography variant="h6">Max 1 Per Mint / 3 Per Wallet</Typography>
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
          <Typography variant="h6">Your balance: {accountData.totalClaimed}</Typography>
        </Box>
      </Box>

      <Box style={{ marginTop: "15px" }} p={1}>
        <Grid container spacing={3} className="grid-container">
          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <Zoom in={true}>
              <Paper className="ohm-card">
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                  <Box>
                    <Typography variant="h5">Creation</Typography>
                    <Box className="preview gif-1"></Box>
                  </Box>

                  <Box m={1}>
                    {genesisData.hoodie1Remaining > 0 ? (
                      <Typography variant="h6">{genesisData.hoodie1Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.hoodie1Claimed}</Typography>
                  </Box>
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => handleMint(1)}
                      style={{ fontWeight: "600" }}
                    >
                      Mint
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <Zoom in={true}>
              <Paper className="ohm-card">
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                  <Box>
                    <Typography variant="h5">Abundance</Typography>
                    <Box className="preview gif-2"></Box>
                  </Box>
                  <Box m={1}>
                    {genesisData.hoodie2Remaining > 0 ? (
                      <Typography variant="h6">{genesisData.hoodie2Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.hoodie2Claimed}</Typography>
                  </Box>
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => handleMint(2)}
                      style={{ fontWeight: "600" }}
                    >
                      Mint
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Zoom>
          </Grid>

          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <Zoom in={true}>
              <Paper className="ohm-card">
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                  <Box>
                    <Typography variant="h5">Flow</Typography>
                    <Box className="preview gif-3"></Box>
                  </Box>
                  <Box m={1}>
                    {genesisData.hoodie3Remaining > 0 ? (
                      <Typography variant="h6">{genesisData.hoodie3Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.hoodie3Claimed}</Typography>
                  </Box>
                </Box>
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
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default GenesisMint;
