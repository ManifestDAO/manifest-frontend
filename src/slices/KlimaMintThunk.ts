import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as wETHERC20Abi } from "../abi/wETHERC20.json";
import { abi as OHMERC20Abi } from "../abi/OHMERC20.json";
import { abi as ManifestKlima1155Abi } from "../abi/ManifestKlima1155.json";

import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "./MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";

function alreadyApprovedToken(token: string, mintAllowanceMNFST: BigNumber, mintAllowanceSMNFST: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "mnfst") {
    applicableAllowance = mintAllowanceMNFST;
  } else if (token === "smnfst") {
    applicableAllowance = mintAllowanceSMNFST;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "klimaMint/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const mnfstContract = new ethers.Contract(addresses[networkID].WETH_ADDRESS as string, wETHERC20Abi, signer);
    const smnfstContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, OHMERC20Abi, signer);
    let approveTx;
    let mintAllowanceMNFST = await mnfstContract.allowance(address, addresses[networkID].KLIMA_1155);
    let mintAllowanceSMNFST = await smnfstContract.allowance(address, addresses[networkID].KLIMA_1155);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, mintAllowanceMNFST, mintAllowanceSMNFST)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          klima: {
            mnfstMintAllowance: +mintAllowanceMNFST,
            smnfstMintAllowance: +mintAllowanceSMNFST,
          },
        }),
      );
    }

    try {
      if (token === "mnfst") {
        // won't run if stakeAllowance > 0
        approveTx = await mnfstContract.approve(
          addresses[networkID].KLIMA_1155,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "smnfst") {
        approveTx = await smnfstContract.approve(
          addresses[networkID].KLIMA_1155,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (token === "mnfst" ? "Mint with MNFST" : "Mint with sMNFST");
      const pendingTxnType = token === "mnfst" ? "approve_mnfst_for_mint" : "approve_smnfst_for_mint";
      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    mintAllowanceMNFST = await mnfstContract.allowance(address, addresses[networkID].KLIMA_1155);
    mintAllowanceSMNFST = await smnfstContract.allowance(address, addresses[networkID].KLIMA_1155);

    return dispatch(
      fetchAccountSuccess({
        klima: {
          mnfstMintAllowance: +mintAllowanceMNFST,
          smnfstMintAllowance: +mintAllowanceSMNFST,
        },
      }),
    );
  },
);
