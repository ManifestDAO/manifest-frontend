import { useState } from "react";
import { Box, Button, Container, Grid, FormControl } from "@material-ui/core";
import { useSelector } from "react-redux";
import View from "../../components/View";
import InventoryOverview from "./InventoryOverview";
import InventoryCard from "./InventoryCard";
import { InventoryMetaDataMapping } from "../inventoryMetaDataMapping";
import { useWeb3Context } from "src/hooks/web3Context";
import CommonGrid from "../../components/Grid";
import ConnectButton from "../../components/ConnectButton";

const defaultValues = [];

function Inventory() {
  const { address } = useWeb3Context();
  const accountData = useSelector(state => state.account);
  const accountBalances = useSelector(state => state.account.balances);
  const [formValues, setFormValues] = useState(defaultValues);

  const handleFormChange = newFormValues => {
    setFormValues([...formValues, newFormValues]);
    console.log(formValues);
  };

  const NFTS = Object.entries(accountData.inventory).reduce((acc, [id, item]) => {
    if (item.quantity == 0) return [...acc];

    const elements = Array.from(Array(Number(item.quantity)).keys(), () => {
      return (
        <Box style={{ marginTop: "15px" }} p={1}>
          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <InventoryCard
              itemName={item.type}
              count={formValues.length}
              handleFormChange={handleFormChange} // should set selected not count. need id to submit form
              nftTitle={InventoryMetaDataMapping.get(item.type).title}
              background={InventoryMetaDataMapping.get(item.type).src}
            />
          </Grid>
        </Box>
      );
    });
    return [...acc, elements];
  }, []);

  const handleSubmit = async () => console.log("handled submit");

  return (
    <View>
      <Container maxWidth="md">
        <Box style={{ marginBottom: "33px" }}>
          <form>
            <InventoryOverview accountData={accountData} accountBalances={accountBalances} />
            <CommonGrid>{NFTS}</CommonGrid>
            <Box textAlign="center" style={{ paddingTop: "32px" }}>
              {!address ? (
                <ConnectButton />
              ) : (
                <Button
                  style={{ marginTop: "25px" }}
                  className="stake-button"
                  variant="contained"
                  color="primary"
                  type="submit"
                  onClick={handleSubmit}
                >
                  {`Claim ${0} Items`}
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Container>
    </View>
  );
}

export default Inventory;

// {Object.entries(accountData.inventory).reduce((acc, [id, item]) => {
//   if (item.quantity == 0) return [...acc];

//   return [
//     ...acc,
//     <Box style={{ marginTop: "15px" }} p={1}>
//       <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
//         <InventoryCard
//           onClick={() => setSelected(!selected)}
//           selected={selected}
//           nftTitle={InventoryMetaDataMapping.get(item.type).title}
//           background={InventoryMetaDataMapping.get(item.type).src}
//         />
//       </Grid>
//     </Box>,
//   ];
// }, [])}

//   <Box style={{ marginTop: "15px" }} p={1}>
//   <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
//     <InventoryCard
//       onClick={() => setSelected(!selected)}
//       selected={selected}
//       nftTitle={InventoryMetaDataMapping.get(item.type).title}
//       background={InventoryMetaDataMapping.get(item.type).src}
//     />
//   </Grid>
// </Box>
