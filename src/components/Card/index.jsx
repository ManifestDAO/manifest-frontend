import { Paper } from "@material-ui/core";
import styled from "styled-components";

export const PaperCard = styled(Paper)`
  padding: 20px;
  text-align: center;
  min-width: 280px;
  max-width: 350px;
  min-height: 300px;
  max-height: 669px;
  background: radial-gradient(100% 100% at 0% 0%, rgba(146, 0, 255, 0.12) 10.42%, rgba(59, 35, 77, 0) 100%),
    rgba(255, 255, 255, 0.05) !important;
`;

export default ({ children }) => <PaperCard>{children}</PaperCard>;
