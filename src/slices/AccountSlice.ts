import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as ManifestERC20Abi } from "../abi/ManifestERC20.json";
import { abi as sManifestERC20Abi } from "../abi/sManifestERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { Bond, NetworkID } from "src/lib/Bond"; // TODO: this type definition needs to move out of BOND.
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const mnfstContract = new ethers.Contract(addresses[networkID].MNFST_ADDRESS as string, ManifestERC20Abi, provider);
    const mnfstBalance = await mnfstContract.balanceOf(address);

    const smnfstContract = new ethers.Contract(
      addresses[networkID].SMNFST_ADDRESS as string,
      sManifestERC20Abi,
      provider,
    );
    const smnfstBalance = await smnfstContract.balanceOf(address);

    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20Abi, provider);
    const sohmBalance = await sohmContract.balanceOf(address);

    return {
      balances: {
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        mnfst: ethers.utils.formatUnits(mnfstBalance, "gwei"),
        smnfst: ethers.utils.formatUnits(smnfstBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  balances: {
    sohm: string;
    mnfst: string;
    smnfst: string;
  };
  staking: {
    mnfstStake: number;
    mnfstUnstake: number;
  };
  // bonding: {
  //   sohmAllowance: number;
  // };
}

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let mnfstBalance = 0;
    let smnfstBalance = 0;
    let sohmBalance = 0;
    let stakeAllowance = 0;
    let unstakeAllowance = 0;
    let sohmBondAllowance = 0;

    if (addresses[networkID].MNFST_ADDRESS) {
      const ohmContract = new ethers.Contract(addresses[networkID].MNFST_ADDRESS as string, ManifestERC20Abi, provider);
      mnfstBalance = await ohmContract.balanceOf(address);
      stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    }

    if (addresses[networkID].SMNFST_ADDRESS) {
      const smnfstContract = new ethers.Contract(
        addresses[networkID].SMNFST_ADDRESS as string,
        sManifestERC20Abi,
        provider,
      );
      smnfstBalance = await smnfstContract.balanceOf(address);
      unstakeAllowance = await smnfstContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
      // sohmBondAllowance = await sohmContract.allowance(address, addresses[networkID]...);
    }

    return {
      balances: {
        sohm: ethers.utils.formatUnits(sohmBalance, "gwei"),
        mnfst: ethers.utils.formatUnits(mnfstBalance, "gwei"),
        smnfst: ethers.utils.formatUnits(smnfstBalance, "gwei"),
      },
      staking: {
        mnfstStake: +stakeAllowance,
        mnfstUnstake: +unstakeAllowance,
      },
      // bonding: {
      //   sohmAllowance: +sohmBondAllowance,
      // },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let interestDue, pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    interestDue = bondDetails.payout / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = 0;
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    sohm: string;
    mnfst: string;
    smnfst: string;
  };
  loading: boolean;
}
const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: { sohm: "", mnfst: "", smnfst: "" },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
