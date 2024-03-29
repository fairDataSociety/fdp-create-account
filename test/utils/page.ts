import { ElementHandle, Page } from "puppeteer";
import { WEB_SERVER_URL } from "../config/constants";

export async function openIndex(path = ""): Promise<Page> {
  const extensionPage = await global.__BROWSER__.newPage();
  await extensionPage.goto(WEB_SERVER_URL + path, {
    waitUntil: "networkidle0",
  });

  return extensionPage;
}

export async function waitForElementText(
  page: Page,
  selector: string
): Promise<string> {
  await page.waitForSelector(selector);

  return await page.$eval(selector, (e) => e.innerHTML);
}

export function waitForElementTextByTestId(
  page: Page,
  id: string
): Promise<string> {
  return waitForElementText(page, dataTestId(id));
}

export async function getElementBySelector(
  page: Page,
  selector: string
): Promise<ElementHandle<Element>> {
  await page.waitForSelector(selector);
  const element = await page.$(selector);

  if (!element)
    throw new Error(`Element with selector ${selector} has been not found`);

  return element;
}

export function dataTestId(id: string): string {
  return `[data-testid="${id}"]`;
}

export function getElementByTestId(
  page: Page,
  id: string
): Promise<ElementHandle<Element>> {
  return getElementBySelector(page, dataTestId(id));
}

export function getElementChildren(
  element: ElementHandle<Element>
): Promise<ElementHandle<Element>[]> {
  return element.$$(":scope > *");
}

export async function isElementDisabled(
  page: Page,
  id: string
): Promise<boolean> {
  return (await page.$(`${dataTestId(id)}[disabled]`)) !== null;
}
