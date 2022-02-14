import PaperCard from "src/components/Card";
import Preview from "src/components/Preview";
import { Box, Zoom } from "@material-ui/core";

export const InventoryCard = ({ nftTitle, background, onClick }) => {
  return (
    <Zoom in={true}>
      <PaperCard>
        <Box onClick={onClick} display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Box>
            <Preview nftTitle={nftTitle} background={background} />
          </Box>
        </Box>
      </PaperCard>
    </Zoom>
  );
};

export default InventoryCard;
