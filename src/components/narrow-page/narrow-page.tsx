import { styled } from "@mui/system";

const NarrowPage = styled("div")({
  display: "flex",
  flexDirection: "column",
  maxWidth: "700px",
  minHeight: "500px",
  margin: "auto",
  marginTop: "50px",
  width: "100%",
  "& > .MuiFormControl-root": {
    margin: "20px 0",
  },
});

export default NarrowPage;
