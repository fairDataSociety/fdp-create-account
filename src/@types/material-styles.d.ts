import "@mui/material/styles/createPalette";
declare module "@mui/material/styles" {
  interface Palette {
    border: Palette["primary"];
    link: Palette["primary"];
    linkHover: Palette["primary"];
    footer: Palette["primary"];
  }
  interface PaletteOptions {
    border: PaletteOptions["primary"];
    link: PaletteOptions["primary"];
    linkHover: PaletteOptions["primary"];
    footer: PaletteOptions["primary"];
  }
}
