import { styled } from "@mui/system";

const Wrapper = styled("div")(({ theme }) => ({
  marginTop: "50px",
  padding: "50px",
  borderRadius: "20px",
  maxWidth: "100%",
  overflow: "hidden",
  border: `1px solid ${theme.palette.border.main}`,
}));

export default Wrapper;
