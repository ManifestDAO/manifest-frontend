import { sha256, toUtf8Bytes } from "ethers/lib/utils";

export const useBasicFeatureToggle = (valueToStore = "none") => {
  const item = window.localStorage.getItem("featurekey");
  if (item == null) {
    window.localStorage.setItem("featurekey", JSON.stringify(valueToStore));
  }
  const hash = sha256(toUtf8Bytes(item));

  if (hash.toUpperCase() == "0X8260310A82C645C480BE1E9335E1D5A4C8E20BB5C33C3E77A101D7DD15D84D3F") {
    return true;
  }

  return false;
};

export default useBasicFeatureToggle;
