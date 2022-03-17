import { useState, useEffect } from "react";
import { useWeb3Context } from "./web3Context";
import { NftSwap } from "@traderxyz/nft-swap-sdk";

export const useSwapSDK = () => {
  const { provider, chainID } = useWeb3Context();
  const [swapSdk, setSwapSdk] = useState(null);
  const signer = provider.getSigner();

  useEffect(() => {
    const sdk = new NftSwap(provider, signer, chainID);
    setSwapSdk(sdk);
  }, [provider, chainID]);

  return swapSdk;
};
export default useSwapSDK;
