import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ManifestERC20Abi } from "../abi/ManifestERC20.json";
import { abi as sManifestERC20Abi } from "../abi/sManifestERC20.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as Genesis1155Abi } from "../abi/Genesis1155.json";
import { abi as ManifestKlima1155Abi } from "../abi/ManifestKlima1155.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
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

    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
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
  genesis: {
    saleEligible: boolean;
    claimed: string;
    balance: string;
  };
  klima: {
    saleEligible: boolean;
    claimed: string;
    balance: string;
  };
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
    // genesis mint
    let genesisSaleEligible = false;
    let genesisClaimed = "0";
    let genesisBalance = "0";
    let genesisClaimed1 = 0;
    let genesisClaimed2 = 0;
    let genesisClaimed3 = 0;
    // klima save the world mint
    let klimaSaleEligible = true;
    let klimaClaimed = "0";
    let klimaBalance = "0";
    let klimaClaimed1 = 0;
    let klimaClaimed2 = 0;
    let klimaClaimed3 = 0;
    let mintAllowanceMNFST = 0;
    let mintAllowanceSMNFST = 0;

    let mnfstContract;
    let smnfstContract;

    if (addresses[networkID].MNFST_ADDRESS) {
      mnfstContract = new ethers.Contract(addresses[networkID].MNFST_ADDRESS as string, ManifestERC20Abi, provider);
      mnfstBalance = await mnfstContract.balanceOf(address);
      stakeAllowance =
        (await mnfstContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS)) / Math.pow(10, 18);
    }

    if (addresses[networkID].SMNFST_ADDRESS) {
      smnfstContract = new ethers.Contract(addresses[networkID].SMNFST_ADDRESS as string, sManifestERC20Abi, provider);
      smnfstBalance = await smnfstContract.balanceOf(address);
      try {
        unstakeAllowance =
          (await smnfstContract.allowance(address, addresses[networkID].STAKING_ADDRESS)) / Math.pow(10, 18);
      } catch (e) {
        console.error(e);
      }
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, sOHMv2, provider);
      sohmBalance = await sohmContract.balanceOf(address);
    }

    if (addresses[networkID].GENESIS_1155) {
      const genesisContract = new ethers.Contract(
        addresses[networkID].GENESIS_1155 as string,
        Genesis1155Abi,
        provider,
      );
      genesisSaleEligible = await genesisContract.checkSaleEligiblity(address);
      genesisClaimed = await genesisContract
        .totalClaimedBy(address)
        .then((amt: BigNumber) => ethers.utils.formatUnits(amt, "wei"));
      genesisClaimed1 = await genesisContract
        .balanceOf(address, 1)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
      genesisClaimed2 = await genesisContract
        .balanceOf(address, 2)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
      genesisClaimed3 = await genesisContract
        .balanceOf(address, 3)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
    }

    if (addresses[networkID].KLIMA_1155) {
      const klimaContract = new ethers.Contract(
        addresses[networkID].KLIMA_1155 as string,
        ManifestKlima1155Abi,
        provider,
      );
      klimaSaleEligible = true; // await klimaContract.checkSaleEligiblity(address);
      klimaClaimed = await klimaContract
        .totalClaimedBy(address)
        .then((amt: BigNumber) => ethers.utils.formatUnits(amt, "wei"));
      klimaClaimed1 = await klimaContract
        .balanceOf(address, 1)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
      klimaClaimed2 = await klimaContract
        .balanceOf(address, 2)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
      klimaClaimed3 = await klimaContract
        .balanceOf(address, 3)
        .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));

      if (mnfstContract) {
        try {
          mintAllowanceMNFST =
            (await mnfstContract.allowance(address, addresses[networkID].KLIMA_1155)) / Math.pow(10, 18);
        } catch (e) {
          console.error(e);
        }
      }

      if (smnfstContract) {
        try {
          mintAllowanceSMNFST =
            (await smnfstContract.allowance(address, addresses[networkID].KLIMA_1155)) / Math.pow(10, 18);
        } catch (e) {
          console.error(e);
        }
      }
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
      genesis: {
        saleEligible: genesisSaleEligible,
        totalClaimed: genesisClaimed,
        creation: genesisClaimed1,
        abundance: genesisClaimed2,
        flow: genesisClaimed3,
      },
      klima: {
        saleEligible: klimaSaleEligible,
        totalClaimed: klimaClaimed,
        cooperation: klimaClaimed1,
        growth: klimaClaimed2,
        protection: klimaClaimed3,
        mnfstMintAllowance: +mintAllowanceMNFST,
        smnfstMintAllowance: +mintAllowanceSMNFST,
      },
      inventory: [
        {
          tokenAddress: `${addresses[networkID].GENESIS_1155}`,
          tokenId: "0",
          type: "ERC1155",
          name: "creation",
          quantity: genesisClaimed1,
        },
        {
          tokenAddress: `${addresses[networkID].GENESIS_1155}`,
          tokenId: "1",
          type: "ERC1155",
          name: "abundance",
          quantity: genesisClaimed2,
        },
        {
          tokenAddress: `${addresses[networkID].GENESIS_1155}`,
          tokenId: "2",
          type: "ERC1155",
          name: "flow",
          quantity: genesisClaimed3,
        },
        {
          tokenAddress: `${addresses[networkID].KLIMA_1155}`,
          tokenId: "0",
          type: "ERC1155",
          name: "cooperation",
          quantity: klimaClaimed1,
        },
        {
          tokenAddress: `${addresses[networkID].KLIMA_1155}`,
          tokenId: "1",
          type: "ERC1155",
          name: "growth",
          quantity: klimaClaimed2,
        },
        {
          tokenAddress: `${addresses[networkID].KLIMA_1155}`,
          tokenId: "2",
          type: "ERC1155",
          name: "protection",
          quantity: klimaClaimed3,
        },
      ],
    };
  },
);

// NFT

// ID  Key          Title    Src  Drop
// 1   "creation"
// 2   "abundance"
// 3   "flow"
// 4   "cooperation"
// 5   "growth"
// 6   "protection"

// foreach (var index in NFT_table)
// {
//   genesisClaimed1 = await genesisContract
//     .balanceOf(address, 1)
//     .then((bal: BigNumber) => ethers.utils.formatUnits(bal, "wei"));
// }

// Inventory of contract-specific items

interface Inventory {
  type: string;
  quantity: string;
}

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
    let balanceVal;
    if (bond.name === "sohm") balanceVal = ethers.utils.formatUnits(balance, "gwei");
    else balanceVal = ethers.utils.formatUnits(balance, "ether");
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
  genesis: {
    saleEligible: boolean;
    totalClaimed: string;
    creation?: string;
    abundance?: string;
    flow?: string;
  };
  klima: {
    saleEligible: boolean;
    totalClaimed: string;
    cooperation?: string;
    growth?: string;
    protection?: string;
    mnfstMintAllowance?: number;
    smnfstMintAllowance?: number;
  };
  loading: boolean;
  inventory: Inventory[];
}

const initialState: IAccountSlice = {
  loading: true,
  bonds: {},
  balances: { sohm: "", mnfst: "", smnfst: "" },
  genesis: {
    saleEligible: false,
    totalClaimed: "0",
    creation: "0",
    abundance: "0",
    flow: "0",
  },
  klima: {
    saleEligible: true,
    totalClaimed: "0",
    cooperation: "0",
    growth: "0",
    protection: "0",
    mnfstMintAllowance: 0,
    smnfstMintAllowance: 0,
  },
  inventory: [],
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
