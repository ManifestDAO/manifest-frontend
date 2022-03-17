import { useState } from "react";
import PaperCard from "src/components/Card";
import Preview from "src/components/Preview";
import { Box, Zoom, Select, FormControl, MenuItem, InputLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  customInputLabel: {
    fontSize: "2em",
  },
}));

export const InventoryCard = ({ item, nftTitle, background, itemName, handleFormChange }) => {
  const [size, setSize] = useState(0);
  const { form, customInputLabel } = useStyles();

  const handleChange = e => {
    console.log("item for thee", item);
    e.stopPropagation();
    const { name, value } = e.target;
    setSize(value);
    handleFormChange({
      tokenId: item.tokenId,
      tokenAddress: item.tokenAddress,
      type: item.type,
      name,
      size: value, // might not need this
    });
  };

  return (
    <Zoom in={true}>
      <PaperCard selected={size}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Preview nftTitle={nftTitle} background={background} />
          </Box>
        </Box>
        <Box textAlign="center">
          <Box textAlign="center">
            <InputLabel>Select Size</InputLabel>
          </Box>
          <FormControl className={form}>
            <Select onChange={handleChange} value={size} name={itemName}>
              {/* need something to tie this selected size to the NFT */}
              <MenuItem className={customInputLabel} value={"small"}>
                Small
              </MenuItem>
              <MenuItem className={customInputLabel} value={"medium"}>
                Medium
              </MenuItem>
              <MenuItem className={customInputLabel} value={"large"}>
                Large
              </MenuItem>
              <MenuItem className={customInputLabel} value={"xlarge"}>
                X Large
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </PaperCard>
    </Zoom>
  );
};

export default InventoryCard;
