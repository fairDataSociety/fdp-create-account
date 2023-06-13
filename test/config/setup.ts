import puppeteer, { Browser } from "puppeteer";

const getConfig = async () => {
  const browser: Browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-web-security"],
  });
  global.__BROWSER__ = browser;
};

export default getConfig;
