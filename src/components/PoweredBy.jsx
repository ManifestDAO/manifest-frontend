import { Box, Typography, Button, Link, SvgIcon } from "@material-ui/core";
import { ReactComponent as PoweredByOlympus } from "../assets/icons/PoweredByOlympusIcon.svg";

export default function PoweredBy() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Typography variant="h5">Powered by </Typography>
      <Button component={Link} href="https://www.olympusdao.finance/" target="_blank" rel="noref">
        <Typography variant="h5" style={{ fontWeight: "bold" }}>
          Olympus
          <SvgIcon
            component={PoweredByOlympus}
            viewBox="0 0 200 200"
            style={{ maxWidth: "33px", width: "33px", height: "20px" }}
          />
        </Typography>
      </Button>
    </Box>
  );
}
