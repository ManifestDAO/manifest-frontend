import { useState } from "react";
import { Box, Button, Container, Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import View from "../../components/View";
import InventoryOverview from "./InventoryOverview";
import InventoryCard from "./InventoryCard";
import { InventoryMetaDataMapping } from "../inventoryMetaDataMapping";
import CommonGrid from "../../components/Grid";

function Inventory() {
  const accountData = useSelector(state => state.account);
  const accountBalances = useSelector(state => state.account.balances);
  const [count, setCount] = useState(0);
  const NFTS = Object.entries(accountData.inventory).reduce((acc, [id, item]) => {
    if (item.quantity == 0) return [...acc];

    const elements = Array.from(Array(Number(item.quantity)).keys(), () => {
      return (
        <Box style={{ marginTop: "15px" }} p={1}>
          <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
            <InventoryCard
              count={count}
              setCount={setCount}
              nftTitle={InventoryMetaDataMapping.get(item.type).title}
              background={InventoryMetaDataMapping.get(item.type).src}
            />
          </Grid>
        </Box>
      );
    });
    return [...acc, elements];
  }, []);

  return (
    <View>
      <Container maxWidth="md">
        <Box style={{ marginBottom: "33px" }}>
          <InventoryOverview accountData={accountData} accountBalances={accountBalances} />
          <CommonGrid>{NFTS}</CommonGrid>
          <Box textAlign="center">
            <Button style={{ marginTop: "25px" }} className="stake-button" variant="contained" color="primary">
              {`Claim ${count} Items`}
            </Button>
          </Box>
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
