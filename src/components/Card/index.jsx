import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const defaultBackground =
  "radial-gradient(100% 100% at 0% 0%, rgba(146, 0, 255, 0.12) 10.42%, rgba(59, 35, 77, 0) 100%), rgba(255, 255, 255, 0.05) !important";
const gradientBackground = `conic-gradient(#aa11ee, #9f11ef, black, #9f11ef, #aa11ee, #9f11ee, black, #9f11ef, #aa11ee, #9f11ee, black, #9f11ef, #aa11ee) !important`;

const lightPurple = "#aa11ee";
const darkPurple = "#9f11ef";

const defaultStyles = {
  padding: "20px",
  textAlign: "center",
  minWidth: "280px",
  maxWidth: "350px",
  minHeight: "300px",
  maxHeight: "669px",
  marginBottom: "1.8rem",
  borderRadius: "10px",
  background: defaultBackground,
};

const useStyles = makeStyles(theme => ({
  paperCard: {
    ...defaultStyles,
  },
  paperCardSecondary: {
    ...defaultStyles,
    border: `5px solid ${lightPurple}`,
  },
}));

export default ({ children, selected, selectPaper }) => {
  const { paperCard, paperCardSecondary } = useStyles(selected);
  return (
    <Paper onClick={selectPaper} className={!selected ? paperCard : paperCardSecondary}>
      {children}
    </Paper>
  );
};
