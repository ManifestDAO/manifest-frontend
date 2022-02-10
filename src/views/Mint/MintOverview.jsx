import Title from "../../components/Typography/Title";
import { Box, Typography } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import NotInterestedIcon from "@material-ui/icons/NotInterested";

export const MintOverview = props => {
  console.log(props);
  return (
    <Box p={1} display="flex" flexDirect="row" justifyContent="space-between" style={{ width: "auto" }}>
      <Box style={{ width: "50%", textAlign: "left" }}>
        <Title variant="h3" style={{ fontWeight: 600 }} background={props.background} titleColor={props.titleColor}>
          {props.title}
        </Title>
        <Box marginTop="10px">
          {props.dropData && (
            <Typography variant="h6">
              {props.dropData.totalMinted} / {props.dropData.totalSupply} Minted
            </Typography>
          )}
          <Typography variant="h6">{props.dropData.price} MNFST</Typography>
          <Typography variant="h6">{props.maxMint}</Typography>
        </Box>
      </Box>

      <Box style={{ width: "50%", textAlign: "right", fontWeight: "500 !important" }}>
        <Typography variant="h6" className={props.accountData.saleEligible ? "wallet-eligible" : ""}>
          {props.accountData.saleEligible ? (
            <CheckIcon
              viewBox="0 0 24 24"
              style={{ height: "11px", width: "11px", marginRight: "3px", color: "green" }}
            />
          ) : (
            <NotInterestedIcon
              viewBox="0 0 24 24"
              style={{ height: "11px", width: "11px", marginRight: "3px", color: "red" }}
            />
          )}
          {props.accountData.saleEligible ? "Wallet Eligible" : "Wallet Ineligible"}
        </Typography>
        <Typography variant="h6">Youve claimed: {props.accountData.totalClaimed}</Typography>
        <Typography variant="h6">MNFST Balance: {Number(props.accountBalances.mnfst).toFixed(2)}</Typography>
        <Typography variant="h6">sMNFST Balance: {Number(props.accountBalances.smnfst).toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export default MintOverview;
