import puppeteer, { Browser } from "puppeteer";

export default async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-web-security"],
  });
  global.__BROWSER__ = browser;
};
