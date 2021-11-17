import { BigNumber, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ManifestStaking } from "../abi/ManifestStaking.json";
import { abi as MNFST } from "../abi/ManifestERC20.json";
import { abi as sMNFST } from "../abi/sManifestERC20.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
// import { NodeHelper } from "../helpers/NodeHelper";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";

const initialState = {
  loading: true,
  loadingMarketPrice: true,
};

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        // stakingTVL,
        // marketPrice,
        // marketCap,
        // circSupply,
        // totalSupply,
        // treasuryMarketValue,
      };
    }
    const currentBlock = await provider.getBlockNumber();

    // Calculating staking
    let epoch;
    let stakingReward = 0;
    let circSupply = 0;
    let stakingRebase = 0;
    let fiveDayRate = 0;
    let stakingAPY = 0;
    let currentIndex = 0;
    let totalSupply = 0;
    let stakingTVL = 0;
    let marketPrice = 33;

    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    try {
      const stakingContract = new ethers.Contract(
        addresses[networkID].STAKING_ADDRESS as string,
        ManifestStaking,
        provider,
      );

      const smnfstMainContract = new ethers.Contract(addresses[networkID].SMNFST_ADDRESS as string, sMNFST, provider);

      epoch = await stakingContract.epoch();
      currentIndex = await stakingContract.index();
      circSupply = await smnfstMainContract.circulatingSupply();
      totalSupply = await smnfstMainContract.totalSupply();
      stakingTVL = (await stakingContract.contractBalance()) / Math.pow(10, 8);

      stakingReward = epoch.distribute / Math.pow(10, 18);
      stakingRebase = stakingReward / circSupply || 0;
      // convenience log
      // console.log(
      //   "reward: " +
      //     stakingReward +
      //     "\ncirc: " +
      //     circSupply +
      //     "\ntotal: " +
      //     totalSupply +
      //     "\nstaking rebase: " +
      //     stakingRebase,
      // );
      fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
      stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
    } catch (e) {
      console.error(e);
    }

    return {
      currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
      currentBlock,
      fiveDayRate,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      // marketCap,
      marketPrice,
      circSupply,
      totalSupply,
      // treasuryMarketValue,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    marketPrice = await getMarketPrice({ networkID, provider });
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

interface IAppData {
  readonly circSupply: number;
  readonly currentIndex?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly marketCap?: number;
  readonly marketPrice: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
