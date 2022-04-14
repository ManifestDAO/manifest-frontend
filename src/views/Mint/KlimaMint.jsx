import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Box, Button, Container, Grid, Paper, Typography, Zoom, Switch, withStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import { loadAppDetails } from "src/slices/AppSlice";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { clearPendingTxn, fetchPendingTxns, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import { abi as ManifestKlima1155Abi } from "src/abi/ManifestKlima1155.json";
import CheckIcon from "@material-ui/icons/Check";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import { changeApproval } from "../../slices/KlimaMintThunk";
import "./mint.scss";

// #aa11ee, #9f11ef

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#aa11ee",
    "&$checked": {
      color: "#9f11ef",
    },
    "&$checked + $track": {
      backgroundColor: "#aa11ee",
    },
  },
  checked: {},
  track: {},
})(Switch);

function KlimaMint() {
  const dispatch = useDispatch();
  const [isMinting, setIsMinting] = useState(false);
  const [buyWithMNFST, setBuyWithMNFST] = useState({
    shirt1: true,
    shirt2: true,
    shirt3: true,
  });
  const { address, chainID, provider } = useWeb3Context();
  const accountData = useSelector(state => state.account.klima);
  const accountBalances = useSelector(state => state.account.balances);
  const klimaData = useSelector(state => state.app.klimaMint);

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const mintAllowanceMNFST = useSelector(state => {
    return state.account.klima && state.account.klima.mnfstMintAllowance;
  });

  const mintAllowanceSMNFST = useSelector(state => {
    return state.account.klima && state.account.klima.smnfstMintAllowance;
  });

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const handleSwitchChange = event => {
    setBuyWithMNFST({ ...buyWithMNFST, [event.target.name]: event.target.checked });
  };

  let klimaContract;

  const isDisabled = () => {
    return isMinting || Number(accountData.totalClaimed) >= 4 || !klimaData.saleStarted;
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "mnfst") return mintAllowanceMNFST > 0;
      if (token === "smnfst") return mintAllowanceSMNFST > 0;
      return 0;
    },
    [mintAllowanceMNFST, mintAllowanceSMNFST],
  );

  useEffect(() => {
    // console.log("account data loaded: ", accountData);
    // console.log("klima data loaded: ", klimaData);
    if (klimaData.contractAddress)
      klimaContract = new ethers.Contract(klimaData.contractAddress, ManifestKlima1155Abi, provider.getSigner());
  }, [accountData, klimaData, isMinting]);

  function handleMint(id) {
    setIsMinting(true);
    mint(id);
  }

  const mint = async id => {
    let mintTx;
    // let curGas = await provider.getGasPrice();

    try {
      // let mnfstAmt = ethers.utils.parseEther(klimaData.price)Math.pow(10, 9);
      // console.log("amount in MNFST: ", mnfstAmt);
      let mnfstSelected = buyWithMNFST["shirt" + id];
      // console.log("buying with mnfst? ", mnfstSelected);

      if (klimaData.contractAddress && !klimaContract)
        klimaContract = new ethers.Contract(klimaData.contractAddress, ManifestKlima1155Abi, provider.getSigner());

      if (mnfstSelected) {
        mintTx = await klimaContract.mintWithMNFST(id);
      } else {
        mintTx = await klimaContract.mintWithSMNFST(id);
      }

      // console.log(mintTx);

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
          <Typography variant="h3" style={{ fontWeight: "600" }} className="title klima-title">
            SΞ△S0N 0: S△VΞ THΞ W0RLD
          </Typography>
          <Box marginTop="10px">
            {klimaData && (
              <Typography variant="h6">
                {klimaData.totalMinted} / {klimaData.totalSupply} Minted
              </Typography>
            )}
            <Typography variant="h6">{klimaData.price / 10e8} wETH</Typography>
            <Typography variant="h6">Max 1 Per Mint / 4 Per Wallet</Typography>
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
          <Typography variant="h6">Youve claimed: {accountData.totalClaimed}</Typography>
          <Typography variant="h6">wETH Balance: {Number(accountBalances.weth).toFixed(2)}</Typography>
          {/* <Typography variant="h6">OHM Balance: {Number(accountBalances.smnfst).toFixed(2)}</Typography> */}
        </Box>
      </Box>

      <Box style={{ marginTop: "15px" }} p={1}>
        <Grid container spacing={3} className="grid-container">
          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <Zoom in={true}>
              <Paper className="ohm-card">
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                  <Box>
                    <Typography variant="h5">Cooperation</Typography>
                    <Box className="preview klima-gif-1"></Box>
                  </Box>
                  <Box m={1}>
                    {klimaData.shirt1Remaining > 0 ? (
                      <Typography variant="h6">{klimaData.shirt1Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.shirt1Claimed}</Typography>
                  </Box>
                  {/* <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    style={{ marginBottom: "20px", width: "100%" }}
                  >
                    <Typography component="div">
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>OHM</Grid>
                        <Grid item>
                          <PurpleSwitch
                            checked={buyWithMNFST.shirt1}
                            onChange={handleSwitchChange}
                            name="shirt1"
                            inputProps={{ "aria-label": "default checkbox" }}
                          />
                        </Grid>
                        <Grid item>wETH</Grid>
                      </Grid>
                    </Typography>
                  </Box> */}
                  <Box>
                    {buyWithMNFST.shirt1 && hasAllowance("mnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => handleMint(1)}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "Minting", "Mint with wETH")}
                      </Button>
                    )}
                    {buyWithMNFST.shirt1 && !hasAllowance("mnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => onSeekApproval("mnfst")}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "approve_mnfst_for_mint", "Approve wETH")}
                      </Button>
                    )}

                    {/* {!buyWithMNFST.shirt1 && hasAllowance("smnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => handleMint(1)}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "Minting", "Mint with OHM")}
                      </Button>
                    )}
                    {!buyWithMNFST.shirt1 && !hasAllowance("smnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => onSeekApproval("smnfst")}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "approve_smnfst_for_mint", "Approve OHM")}
                      </Button>
                    )} */}
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
                    <Typography variant="h5">Growth</Typography>
                    <Box className="preview klima-gif-2"></Box>
                  </Box>
                  <Box m={1}>
                    {klimaData.shirt2Remaining > 0 ? (
                      <Typography variant="h6">{klimaData.shirt2Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.shirt2Claimed}</Typography>
                  </Box>
                  {/* <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    style={{ marginBottom: "20px", width: "100%" }}
                  >
                    <Typography component="div">
                      <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>OHM</Grid>
                        <Grid item>
                          <PurpleSwitch
                            checked={buyWithMNFST.shirt2}
                            onChange={handleSwitchChange}
                            name="shirt2"
                            inputProps={{ "aria-label": "default checkbox" }}
                          />
                        </Grid>
                        <Grid item>wETH</Grid>
                      </Grid>
                    </Typography>
                  </Box> */}
                  <Box>
                    {buyWithMNFST.shirt2 && hasAllowance("mnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => handleMint(2)}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "Minting", "Mint with wETH")}
                      </Button>
                    )}
                    {buyWithMNFST.shirt2 && !hasAllowance("mnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => onSeekApproval("mnfst")}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "approve_mnfst_for_mint", "Approve wETH")}
                      </Button>
                    )}

                    {/* {!buyWithMNFST.shirt2 && hasAllowance("smnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => handleMint(2)}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "Minting", "Mint with OHM")}
                      </Button>
                    )}
                    {!buyWithMNFST.shirt2 && !hasAllowance("smnfst") && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isDisabled()}
                        onClick={() => onSeekApproval("smnfst")}
                        style={{ fontWeight: "600" }}
                      >
                        {txnButtonText(pendingTransactions, "approve_smnfst_for_mint", "Approve OHM")}
                      </Button>
                    )} */}
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
                    <Typography variant="h5">Protection</Typography>
                    <Box className="preview klima-gif-3"></Box>
                  </Box>
                  <Box m={1}>
                    {klimaData.shirt3Remaining > 0 ? (
                      <Typography variant="h6">{klimaData.shirt3Remaining} Available</Typography>
                    ) : (
                      <Typography variant="h6">Sold Out</Typography>
                    )}
                    <Typography>Youve minted: {accountData.shirt3Claimed}</Typography>
                  </Box>
                </Box>
                {/* <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  style={{ marginBottom: "20px", width: "100%" }}
                >
                  <Typography component="div">
                    <Grid component="label" container alignItems="center" spacing={1}>
                      <Grid item>OHM</Grid>
                      <Grid item>
                        <PurpleSwitch
                          checked={buyWithMNFST.shirt3}
                          onChange={handleSwitchChange}
                          name="shirt3"
                          inputProps={{ "aria-label": "default checkbox" }}
                        />
                      </Grid>
                      <Grid item>wETH</Grid>
                    </Grid>
                  </Typography>
                </Box> */}
                <Box>
                  {buyWithMNFST.shirt3 && hasAllowance("mnfst") && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => handleMint(3)}
                      style={{ fontWeight: "600" }}
                    >
                      {txnButtonText(pendingTransactions, "Minting", "Mint with wETH")}
                    </Button>
                  )}
                  {buyWithMNFST.shirt3 && !hasAllowance("mnfst") && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => onSeekApproval("mnfst")}
                      style={{ fontWeight: "600" }}
                    >
                      {txnButtonText(pendingTransactions, "approve_mnfst_for_mint", "Approve wETH")}
                    </Button>
                  )}

                  {/* {!buyWithMNFST.shirt3 && hasAllowance("smnfst") && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => handleMint(3)}
                      style={{ fontWeight: "600" }}
                    >
                      {txnButtonText(pendingTransactions, "Minting", "Mint with sMNFST")}
                    </Button>
                  )}
                  {!buyWithMNFST.shirt3 && !hasAllowance("smnfst") && (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isDisabled()}
                      onClick={() => onSeekApproval("smnfst")}
                      style={{ fontWeight: "600" }}
                    >
                      {txnButtonText(pendingTransactions, "approve_smnfst_for_mint", "Approve sMNFST")}
                    </Button>
                  )} */}
                </Box>
              </Paper>
            </Zoom>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default KlimaMint;
