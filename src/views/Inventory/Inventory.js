import { useState } from "react";
import { Box, Button, Container, Grid } from "@material-ui/core";
import { useSelector } from "react-redux";
import View from "../../components/View";
import InventoryOverview from "./InventoryOverview";
import InventoryCard from "./InventoryCard";

function Inventory() {
  const accountData = useSelector(state => state.account.klima);
  const accountBalances = useSelector(state => state.account.balances);

  const [size, setSize] = useState("");
  const [amount, setAmount] = useState(0);
  const [selected, setSelected] = useState(0);

  return (
    <View>
      <Container maxWidth="md">
        <Box style={{ marginBottom: "33px" }}>
          <InventoryOverview accountData={accountData} accountBalances={accountBalances} />
          {[
            {
              id: 1,
              title: "Cooperation",
              src: "./images/t-shirt-1-cooperation.gif",
              drop: "klima",
              itemStyle: "shirt1",
              claimed: accountData.shirt1Claimed,
            },
          ].map(item => {
            return (
              <Box style={{ marginTop: "15px" }} p={1}>
                <Grid item lg={4} md={4} style={{ textAlign: "center" }}>
                  <InventoryCard
                    onClick={() => setSelected(+1)}
                    nftTitle={item.title}
                    background={item.src}
                    itemsClaimed={item.claimed}
                  />
                </Grid>
              </Box>
            );
          })}

          <Button className="stake-button" variant="contained" color="primary">
            {`Claim (${amount})`}
          </Button>
        </Box>
      </Container>
    </View>
  );
}

export default Inventory;
