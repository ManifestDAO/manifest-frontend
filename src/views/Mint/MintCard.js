import { PaperCard } from "src/components/Card";
import { Box, Zoom } from "@material-ui/core";
import { MintButton } from "./MintButton";
import { MintDescription } from "./MintDescription";
import Preview from "src/components/Preview";

export const MintCard = ({
  mintButtonLabel,
  children,
  nftTitle,
  itemsClaimed,
  itemsRemaining,
  isDisabled,
  handleMint,
  background,
}) => {
  return (
    <Zoom in={true}>
      <PaperCard>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Preview nftTitle={nftTitle} background={background} />
          </Box>
          <MintDescription itemsClaimed={itemsClaimed} itemsRemaining={itemsRemaining} />
        </Box>
        {children}
      </PaperCard>
    </Zoom>
  );
};
