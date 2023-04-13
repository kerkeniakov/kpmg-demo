import { TESTS_TIMEOUT_MAX } from "../constants/testconstants";
import { ChainablePromiseElement } from 'webdriverio';

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
export default class Page {
    public get getFiltersElement(): ChainablePromiseElement<WebdriverIO.Element> {
        return $('//a[contains(text(),"Filters")]');
    }

    public get getSubmitButton(): ChainablePromiseElement<WebdriverIO.Element> {
        return $('//button[contains(text(),"Submit")]');
    }

    public async navigateToMainPage(): Promise<string> {
        return await browser.url(process.env.BASE_URL);
    }

    async returnListWithAllDownloadedChromeFiles(): Promise<string[]> {
        return await browser.execute(`
        var  allDownloadedItems = document.querySelector('downloads-manager').shadowRoot.querySelectorAll('downloads-item');
        var desiredDownloadedFileNames=[];
        for (let i = 0; i < allDownloadedItems.length; i++) {
         var currentDownloadedItemName = allDownloadedItems[i].shadowRoot.querySelector('a').innerText;
         desiredDownloadedFileNames.push(currentDownloadedItemName)
        }
        return desiredDownloadedFileNames;
        `)
    }

    public async getCoordsForElement(elementId) {
        const rect = await browser.getElementRect(elementId);
        const X = rect.x + (rect.width / 2);
        const Y = rect.y + (rect.height / 2);
        return [Math.trunc(X), Math.trunc(Y)];
    };
    /**
     *
     * @param element target element to be clicked.
     * @param x
     * @param y
     */
    async slideElementInPixels(element: WebdriverIO.Element, x: number, y: number) {
        await browser.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'mouse' },
            actions: [
                { type: 'pointerMove', duration: 0, origin: element, x: 0, y: 0 },
                { type: 'pointerDown', button: 0 },
                { type: 'pointerMove', duration: 100, origin: element, x: x, y: y },
                { type: 'pointerUp', button: 0 },
            ]
        }]);
    }

    async returnElementValue(element: WebdriverIO.Element): Promise<string> {
        await element.waitForExist({ timeout: TESTS_TIMEOUT_MAX });
        return await element.getValue();
    }

    async scrollToTop() {
        await browser.executeScript("window.scrollTo(0, 0)", [])
    }

    /**
     *
     * @param element
     * @param timeOutMessage
     * @param timeout
     */
    async waitUntilElementIsInViewport(element: WebdriverIO.Element | string, timeOutMessage?: string, timeout?: number) {
        if (typeof element === 'string') {
            await browser.waitUntil(async () => (await $(`${element}`).isDisplayedInViewport()) === true,
                {
                    timeout: timeout ? TESTS_TIMEOUT_MAX : timeout,
                    timeoutMsg: timeOutMessage !== undefined ? timeOutMessage : `Element ${element} is not in viewport`
                });
        } else {
            await browser.waitUntil(async () => (await element.isDisplayedInViewport()) === true,
                {
                    timeout: timeout ? TESTS_TIMEOUT_MAX : timeout,
                    timeoutMsg: timeOutMessage !== undefined ? timeOutMessage : `Element ${element.selector} is not in viewport`
                });
        }

    }
    /**
     *
     * @param element
     * @param timeOutMessage
     * @param timeout
     */
    async waitUntilElementHasValue(element: WebdriverIO.Element | string, timeOutMessage?: string, timeout?: number) {
        if (typeof element === 'string') {
            await browser.waitUntil(async () => (await (await $(`${element}`).getText()).length) > 0,
                {
                    timeout: timeout ? TESTS_TIMEOUT_MAX : timeout,
                    timeoutMsg: timeOutMessage !== undefined ? timeOutMessage : `Element ${element} is not in viewport`
                });
        } else {
            await browser.waitUntil(async () => (await (await element.getText()).length) > 0,
                {
                    timeout: timeout ? TESTS_TIMEOUT_MAX : timeout,
                    timeoutMsg: timeOutMessage !== undefined ? timeOutMessage : `Element ${element.selector} has 0 length`
                });
        }
    }
}
