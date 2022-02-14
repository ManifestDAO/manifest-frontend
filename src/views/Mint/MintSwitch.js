import { Box, Grid, Typography, Switch, withStyles } from "@material-ui/core";

const PurpleSwitch = withStyles({
  switchBase: {
    color: "#aa11ee",
    "&$checked": {
      color: "#9f11ef",
    },
    "&$checked + $track": {
      backgroundColor: "#aa11ee",
    },
  },
  checked: {},
  track: {},
})(Switch);

export const MintSwitch = ({ itemStyle, checked, handleSwitchChange, label = "MNFST" }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" style={{ marginBottom: "20px", width: "100%" }}>
      <Typography component="div">
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item>sMNFST</Grid>
          <Grid item>
            <PurpleSwitch
              checked={checked}
              onChange={handleSwitchChange}
              name={itemStyle}
              inputProps={{ "aria-label": "default checkbox" }}
            />
          </Grid>
          <Grid item>{label}</Grid>
        </Grid>
      </Typography>
    </Box>
  );
};

export default MintSwitch;
