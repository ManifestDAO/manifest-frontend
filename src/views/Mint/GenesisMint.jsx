import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Grid, Zoom } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useWeb3Context } from "src/hooks";
import { loadAppDetails } from "src/slices/AppSlice";
import { loadAccountDetails } from "src/slices/AccountSlice";
import { clearPendingTxn, fetchPendingTxns } from "src/slices/PendingTxnsSlice";
import { error } from "src/slices/MessagesSlice";
import { abi as Genesis1155Abi } from "src/abi/Genesis1155.json";
import { MintCard } from "./MintCard";
import MintOverview from "./MintOverview";
import "./mint.scss";
import { MintButton } from "./MintButton";

function GenesisMint() {
  const dispatch = useDispatch();
  const [isMinting, setIsMinting] = useState(false);
  const { provider } = useWeb3Context();
  const accountData = useSelector(state => state.account.genesis);
  const accountBalances = useSelector(state => state.account.balances);
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

  console.log("genesisData", genesisData, "accountData", accountData);
  return (
    <Box style={{ marginBottom: "33px" }}>
      <MintOverview
        title="SΞASON 0: GΞNΞS1S"
        background="linear-gradient(to right, #aa11ee, #9f11ef)"
        dropData={genesisData}
        accountData={accountData}
        accountBalances={accountBalances}
        maxMint="Max 1 Per Mint / 3 Per Wallet"
      />

      <Box style={{ marginTop: "15px" }} p={1}>
        <Grid container spacing={3} className="grid-container">
          {[
            {
              id: 1,
              title: "Creation",
              src: "./images/01_creation.gif",
              drop: "klima",
              itemStyle: "shirt1",
              stock: genesisData.hoodie1Remaining,
              claimed: accountData,
            },
            {
              id: 2,
              title: "Abundance",
              src: "./images/02_abundance.gif",
              drop: "klima",
              itemStyle: "shirt2",
              stock: genesisData.hoodie2Remaining,
              claimed: accountData,
            },
            {
              id: 3,
              title: "Flow",
              src: "./images/03_flow.gif",
              drop: "klima",
              itemStyle: "shirt3",
              stock: genesisData.hoodie3Remaining,
              claimed: accountData,
            },
          ].map(mint => {
            return (
              <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
                <MintCard
                  nftTitle={mint.title}
                  background={mint.src}
                  itemsClaimed={accountData.claimed}
                  itemsRemaining={genesisData.stock}
                  isDisabled={isDisabled}
                  handleMint={handleMint}
                >
                  <MintButton />
                </MintCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}

export default GenesisMint;
