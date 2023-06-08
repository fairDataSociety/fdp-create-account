import { styled } from "@mui/system";

const NarrowPage = styled("div")({
  display: "flex",
  flexDirection: "column",
  maxWidth: "700px",
  minHeight: "500px",
  marginTop: "30px",
  width: "100%",
  margin: "auto",
  "& > .MuiFormControl-root": {
    margin: "20px 0",
  },
});

export default NarrowPage;
