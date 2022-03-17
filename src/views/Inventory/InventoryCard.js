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

export const InventoryCard = ({ nftTitle, background, itemName, handleFormChange }) => {
  const [size, setSize] = useState("Size");
  const { form, customInputLabel } = useStyles();

  const handleChange = e => {
    e.stopPropagation();
    const { name, value } = e.target;
    setSize(value);
    handleFormChange({
      [name]: value,
    });
  };

  const selectPaper = () => {
    //   setSelected(!selected);
    //   if (!selected) return setCount(count + 1);
    //   if (selected) return setCount(count - 1);
  };

  return (
    <Zoom in={true}>
      <PaperCard selectPaper={selectPaper} selected={""}>
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
