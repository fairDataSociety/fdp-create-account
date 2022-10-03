import { styled } from "@mui/system";

const Form = styled("form")({
  display: "flex",
  flexDirection: "column",
  maxWidth: "500px",
  marginTop: "30px",
  width: "100%",
  margin: "auto",
  "& > .MuiFormControl-root": {
    margin: "20px 0",
  },
});

export default Form;
