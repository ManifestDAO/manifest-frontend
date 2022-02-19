import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  gridContainer: {
    [theme.breakpoints.down("1024")]: {
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.down("sm")]: {
      justifyContent: "center",
      // flexFlow: "column",
      alignItems: "center",
    },
  },
}));

export default props => {
  const classes = useStyles();
  return (
    <Grid container spacing={3} className={classes.gridContainer}>
      {props.children}
    </Grid>
  );
};
