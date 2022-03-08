import { sha256, toUtf8Bytes } from "ethers/lib/utils";

export const useBasicFeatureToggle = (valueToStore = "none") => {
  const item = window.localStorage.getItem("featurekey");
  if (item == null) {
    window.localStorage.setItem("featurekey", JSON.stringify(valueToStore));
  }
  const hash = sha256(toUtf8Bytes(item));

  if (hash.toUpperCase() == "0X7037C60FDE113376A8BF3DCCDAA576533AB48B3837E26B0510E8CE38D8D5A310") {
    return true;
  }

  return false;
};

export default useBasicFeatureToggle;
