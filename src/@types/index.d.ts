import { Browser } from "puppeteer";

declare global {
  // eslint-disable-next-line no-var
  var __BROWSER__: Browser;
}
