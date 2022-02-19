import { useState } from "react";
import PaperCard from "src/components/Card";
import Preview from "src/components/Preview";
import { Box, Zoom, FormControl, Select, MenuItem, InputLabel, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%",
  },
  customInputLabel: {
    fontSize: "2em",
  },
}));

export const InventoryCard = ({ nftTitle, background, count, setCount }) => {
  const [selected, setSelected] = useState(false);
  const [size, setSize] = useState("Size");
  const { form, customInputLabel } = useStyles();

  const handleChange = e => {
    e.stopPropagation();
    setSize(e.target.value);
  };
  const selectPaper = () => {
    setSelected(!selected);
    if (!selected) return setCount(count + 1);
    if (selected) return setCount(count - 1);
  };

  return (
    <Zoom in={true}>
      <PaperCard selectPaper={selectPaper} selected={selected}>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Preview nftTitle={nftTitle} background={background} />
          </Box>
        </Box>
        <Box textAlign="center">
          <FormControl className={form}>
            <Box textAlign="center">
              <InputLabel>Select Size</InputLabel>
            </Box>
            <Select onChange={handleChange} value={size}>
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
