import { PaperCard } from "src/components/Card";
import { Box } from "@material-ui/core";
import { MintButton } from "./MintButton";
import { MintDescription } from "./MintDescription";
import Preview from "src/components/Preview";

export const MintCard = ({ nftTitle, itemsClaimed, itemsRemaining, isDisabled, handleMint, background }) => {
  return (
    <PaperCard>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <Box>
          <Preview nftTitle={nftTitle} background={background} />
        </Box>
        <MintDescription itemsClaimed={itemsClaimed} itemsRemaining={itemsRemaining} />
      </Box>
      <MintButton isDisabled={isDisabled} handleMint={handleMint} />
    </PaperCard>
  );
};
