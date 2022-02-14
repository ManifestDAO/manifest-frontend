import { Container, Divider } from "@material-ui/core";
import GenesisMint from "./GenesisMint";
import KlimaMint from "./KlimaMint";
import View from "../../components/View";
// import "./mint.scss";

function Mint() {
  return (
    <View>
      <Container maxWidth="md">
        <KlimaMint />
        <Divider style={{ marginBottom: "33px" }} />
        <GenesisMint />
      </Container>
    </View>
  );
}

export default Mint;
