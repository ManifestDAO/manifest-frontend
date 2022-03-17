import PaperCard from "src/components/Card";
import Preview from "src/components/Preview";
import { Box, Zoom } from "@material-ui/core";
import { MintDescription } from "./MintDescription";

export const MintCard = ({ children, nftTitle, itemsClaimed, itemsRemaining, background }) => {
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
