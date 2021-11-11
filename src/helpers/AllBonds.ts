import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { addresses } from "src/constants";
import { ReactComponent as MnfstOhmImg } from "src/assets/tokens/MNFST-OHM.svg";
import { ReactComponent as wETHImg } from "src/assets/tokens/wETH.svg";
import { ReactComponent as sOhmImg } from "src/assets/tokens/token_sOHM.svg";

import { abi as BondOhmEthContract } from "src/abi/bonds/OhmEthContract.json";

import { abi as ReserveOhmEthContract } from "src/abi/reserves/OhmEth.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "src/helpers/BondCalculator";

// TODO(zx): Further modularize by splitting up reserveAssets into vendor token definitions
//   and include that in the definition of a bond

export const eth = new CustomBond({
  name: "eth",
  displayName: "wETH",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "wETH",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: wETHImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x4b53412beaad7d62cd00754757632f939391487b",
      reserveAddress: "",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const ethBondContract = this.getContractForBond(networkID, provider);
    let ethPrice = await ethBondContract.assetPrice();
    ethPrice = ethPrice / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    ethAmount = ethAmount / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const ohm_mnfst = new CustomBond({
  name: "ohm_mnfst_lp",
  displayName: "OHM-MNFST LP",
  bondToken: "OHM",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: MnfstOhmImg,
  bondContractABI: BondOhmEthContract,
  reserveContract: ReserveOhmEthContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xD67838dD745c16F180057A0A76039ae6C38901C3",
      reserveAddress: "0x89c4d11dfd5868d847ca26c8b1caa9c25c712cef",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  bondType: BondType.LP,
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    if (networkID === NetworkID.Mainnet) {
      const BondContract = this.getContractForBond(networkID, provider);
      let ohmPrice = await BondContract.assetPrice();
      ohmPrice = ohmPrice / Math.pow(10, 9);
      const token = this.getContractForReserve(networkID, provider);
      const tokenAddress = this.getAddressForReserve(networkID);
      const bondCalculator = getBondCalculator(networkID, provider);
      const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress);
      let tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));
      return tokenUSD * ohmPrice;
    } else {
      // NOTE (appleseed): using OHM-DAI on rinkeby
      const token = this.getContractForReserve(networkID, provider);
      const tokenAddress = this.getAddressForReserve(networkID);
      const bondCalculator = getBondCalculator(networkID, provider);
      const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress);
      let tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));
      return tokenUSD;
    }
  },
});

export const sohm = new CustomBond({
  name: "sohm",
  displayName: "sOHM",
  lpUrl: "",
  bondType: BondType.StableAsset,
  bondToken: "sOHM",
  isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  bondIconSvg: sOhmImg,
  bondContractABI: EthBondContract,
  reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
    [NetworkID.Testnet]: {
      bondAddress: "",
      reserveAddress: "",
    },
  },
  customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
    const sohmBondContract = this.getContractForBond(networkID, provider);
    let sohmPrice = await sohmBondContract.assetPrice();
    sohmPrice = sohmPrice / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let sohmAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
    sohmAmount = sohmAmount / Math.pow(10, 18);
    return sohmAmount * sohmPrice;
  },
});

// HOW TO ADD A NEW BOND:
// Is it a stableCoin bond? use `new StableBond`
// Is it an LP Bond? use `new LPBond`
// Add new bonds to this array!!
export const allBonds = [eth, ohm_mnfst, sohm];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});

// Debug Log
// console.log(allBondsMap);
export default allBonds;
