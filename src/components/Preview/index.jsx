import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  preview: {
    marginTop: "10px",
    width: "100%",
    minWidth: "200px",
    display: "flex",
    minHeight: "220px",
    maxHeight: "220px",
    height: "auto",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "center",
    [theme.breakpoints.down("1024")]: {
      minHeight: "300px",
      minWidth: "200px",
    },
  },
}));

export default ({ nftTitle, background, children }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5">{nftTitle}</Typography>
      <Box className={classes.preview} style={{ backgroundImage: `url(${background})` }}>
        {children}
      </Box>
    </>
  );
};
