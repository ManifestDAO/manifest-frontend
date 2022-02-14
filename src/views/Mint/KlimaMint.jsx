import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { Box, Grid, Switch, withStyles } from "@material-ui/core";
import CommonGrid from "../../components/Grid";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import { loadAppDetails } from "src/slices/AppSlice";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { clearPendingTxn, fetchPendingTxns, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import { abi as ManifestKlima1155Abi } from "src/abi/ManifestKlima1155.json";
import { changeApproval } from "../../slices/KlimaMintThunk";
import { MintCard } from "./MintCard";
import { MintSwitch } from "./MintSwitch";
import { MintButton } from "./MintButton";
import "./mint.scss";
import MintOverview from "./MintOverview";

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
  const approveMNFST = () => onSeekApproval("mnfst");
  const approveSMNFST = () => onSeekApproval("smnfst");
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
      <MintOverview
        title="SΞ△S0N 0: S△VΞ THΞ W0RLD"
        background="linear-gradient(to right, #35a937, #1797d3)"
        titleColor="linear-gradient(90deg, #35a937, #1797d3)"
        dropData={klimaData}
        accountData={accountData}
        accountBalances={accountBalances}
        maxMint="Max 1 Per Mint / 4 Per Wallet"
      />
      <Box style={{ marginTop: "15px" }} p={1}>
        <CommonGrid>
          {[
            {
              id: 1,
              title: "Cooperation",
              src: "./images/t-shirt-1-cooperation.gif",
              drop: "klima",
              itemStyle: "shirt1",
              stock: klimaData.shirt1Remaining,
              claimed: accountData.shirt1Claimed,
              buyWithMNFST: buyWithMNFST.shirt1,
            },
            {
              id: 2,
              title: "Growth",
              src: "./images/t-shirt-3-growth.gif",
              drop: "klima",
              itemStyle: "shirt2",
              stock: klimaData.shirt2Remaining,
              claimed: accountData.shirt2Claimed,
              buyWithMNFST: buyWithMNFST.shirt2,
            },
            {
              id: 3,
              title: "Protection",
              src: "./images/t-shirt-2-protection.gif",
              drop: "klima",
              itemStyle: "shirt3",
              stock: klimaData.shirt3Remaining,
              claimed: accountData.shirt3Claimed,
              buyWithMNFST: buyWithMNFST.shirt3,
            },
          ].map(mint => {
            const mintButton = condition => {
              if (condition) {
                if (hasAllowance("mnfst")) {
                  return (
                    <MintButton disabled={isDisabled()} handleMint={() => handleMint(mint.id)}>
                      {txnButtonText(pendingTransactions, "Minting", "Mint with MNFST")}
                    </MintButton>
                  );
                }
                if (!hasAllowance("mnfst")) {
                  return (
                    <MintButton disabled={isDisabled()} handleMint={approveMNFST}>
                      {txnButtonText(pendingTransactions, "approve_mnfst_for_mint", "Approve MNFST")}
                    </MintButton>
                  );
                }
              }
              if (!condition) {
                if (hasAllowance("smnfst")) {
                  return (
                    <MintButton disabled={isDisabled()} handleClick={() => handleMint(mint.id)}>
                      {txnButtonText(pendingTransactions, "Minting", "Mint with sMNFST")}
                    </MintButton>
                  );
                }
                if (!hasAllowance("smnfst")) {
                  return (
                    <MintButton disabled={isDisabled()} handleClick={approveSMNFST}>
                      {txnButtonText(pendingTransactions, "approve_smnfst_for_mint", "Approve sMNFST")}
                    </MintButton>
                  );
                }
              }
            };
            return (
              <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
                <MintCard
                  nftTitle={mint.title}
                  background={mint.src}
                  itemsClaimed={mint.claimed}
                  itemsRemaining={mint.stock}
                  isDisabled={isDisabled}
                  handleMint={handleMint}
                >
                  <MintSwitch
                    itemStyle={mint.itemStyle}
                    id={mint.id}
                    checked={mint.buyWithMNFST}
                    handleSwitchChange={handleSwitchChange}
                  />
                  <Box>{mintButton(buyWithMNFST[mint.itemStyle])}</Box>
                </MintCard>
              </Grid>
            );
          })}
        </CommonGrid>
      </Box>
    </Box>
  );
}

export default KlimaMint;
