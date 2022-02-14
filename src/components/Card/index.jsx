import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  paperCard: {
    padding: "20px",
    textAlign: "center",
    minWidth: "280px",
    maxWidth: "350px",
    minHeight: "300px",
    maxHeight: "669px",
    marginBottom: "1.8rem",
    borderRadius: "10px",
    background:
      "radial-gradient(100% 100% at 0% 0%, rgba(146, 0, 255, 0.12) 10.42%, rgba(59, 35, 77, 0) 100%), rgba(255, 255, 255, 0.05) !important",
  },
}));

export default props => {
  const classes = useStyles();
  return <Paper className={classes.paperCard}>{props.children}</Paper>;
};
