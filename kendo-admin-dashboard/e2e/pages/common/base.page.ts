import {Download, expect, Locator, Page} from '@playwright/test';

export class BasePage {
    protected page: Page;
    private readonly loadingElement = '#spinnerMask';
    private readonly comboboxInput = ' .clr-combobox-input';
 
    constructor(page: Page) {
       this.page = page;
    }
 
    /**
    * Fetch the OS name via NodeJS
    */
    async getOperationSystemName(): Promise<string> {
        return process.platform;
    }

    /**
    * Is element visible on the page by Selector
    * @param elementSelector
    * @param options
    */
    async isElementVisibleOnPage(elementSelector: string, options: any = null): Promise<boolean> {
        if (options) {
            return this.page.locator(elementSelector, options).isVisible();
        } else {
            return this.page.isVisible(elementSelector);
        }
    }

    /**
    * Is element visible on the page by Locator
    * @param {Locator} elementLocator
    * @param {number} newTimeout
    */
    async isElementVisibleOnPageByLocator(elementLocator: Locator, newTimeout: number = 2000): Promise<boolean> {
        try {
            await elementLocator.waitFor({state: 'visible', timeout: newTimeout});
        } catch (e) {
            return false;
        }
        return true;
    }

    /**
    * Wait element to be visible by Selector
    * @param elementSelector
    * @param options
    */
    async waitElementToBeVisible(elementSelector: string, options?: any): Promise<void> {
        if (options) {
            await this.page.locator(elementSelector, options).first().waitFor({state: 'visible'});
        } else {
            await this.page.waitForSelector(elementSelector, {state: 'visible'});
        }
    }

    /**
    * Wait element to be visible by Locator
    * @param elementLocator
    */
    async waitElementsToBeVisibleByLocator(elementLocator: Locator): Promise<void> {
        await elementLocator.last().waitFor({state: 'visible'});
    }

    /**
    * Wait for an element to be attached on the DOM by Selector
    * The default wait is 30 seconds
    * @param elementSelector
    * @param options
    * @param newTimeout
    */
    async waitElementToBeAttached(elementSelector: string, options?: any, newTimeout: number = 30000): Promise<void> {
        let elementLocator: Locator;
        if (options) {
            elementLocator = this.page.locator(elementSelector, options).first();
        } else {
            elementLocator = this.page.locator(elementSelector).first();
        }
        await this.waitElementToBeAttachedByLocator(elementLocator);
    }

    /**
    * Wait for an element to be attached on the DOM by Locator
    * The default wait is 30 seconds
    * @param elementLocator
    * @param newTimeout
    */
    async waitElementToBeAttachedByLocator(elementLocator: Locator, newTimeout: number = 60000): Promise<void> {
        await elementLocator.waitFor({state: 'attached', timeout: newTimeout});
    }

    /**
    * Clear input field's value
    * @param {string} elementSelector
    */
    async clearInputField(elementSelector: string): Promise<void> {
        await this.page.locator(elementSelector).clear();
    }
    
   /**
    * Click on element
    * @param elementSelector
    * @param elementOptions
    * @param clickOptions
    */
   async clickElement(elementSelector: string, elementOptions?: any, clickOptions?: any): Promise<void> {
        if (elementOptions) {
        const firstElement = this.page.locator(elementSelector, elementOptions).first();
        await this.waitElementsToBeVisibleByLocator(firstElement);
        await firstElement.click(clickOptions);
        } else {
        await this.waitElementToBeVisible(elementSelector);
        await this.page.click(elementSelector, clickOptions);
        }
    }

    /**
    * Set text into an input field
    * @param {string} elementSelector
    * @param {string | number} inputValue
    * @param {boolean} clearBeforeInput default value is true
    * @param {boolean} pressEnter default value is false
    * @param {boolean} pressCtrAndA default value is false
    * @param {number} delayTime default value is 0ms
    * @param {boolean} useFillMethod
    */
   async setInputField(elementSelector: string, inputValue: string | number, clearBeforeInput: boolean = true,
        pressEnter: boolean = false, pressCtrAndA: boolean = false, delayTime: number = 0, useFillMethod: boolean = false): Promise<void> {
        await this.waitElementToBeVisible(elementSelector);
        if (clearBeforeInput) {
            await this.clearInputField(elementSelector);
        }
        if (pressCtrAndA) {
            const osName = await this.getOperationSystemName();
            // "Darwin" is the default name for MacOS. Source: https://nodejs.org/api/process.html#process_process_platform
            if (osName === 'darwin') {
                await this.page.keyboard.press('Meta+A');
            } else {
                await this.page.press(elementSelector, 'Control+A');
            }
        }
        if (useFillMethod) {
            await this.page.fill(elementSelector, inputValue.toString().trim());
        } else {
            await this.page.type(elementSelector, inputValue.toString().trim(), {delay: delayTime});
        }
        if (pressEnter) {
            await this.page.press(elementSelector, 'Enter');
        }
    }

    /**
    * Get text of an element by Locator
    * @param {Locator} elementsLocator
    */
    async getTextOfElementByLocator(elementsLocator: Locator): Promise<string> {
        try {
        const rawText = await elementsLocator.innerText();
            return rawText.trim();
        } catch (e) {
            return '';
        }
    }

    /**
    * Get text from array of elements
    * @param {Locator} elementsLocator
    */
    async getTextOfElementsByLocator(elementsLocator: Locator): Promise<Array<string>> {
        try {
            const tempArray = await elementsLocator.allInnerTexts();
            return Array.from(tempArray, item => item.trim());
        } catch (e) {
            return [];
        }
    }

    /**
    * Is field disabled by Locator
    * @param elementLocator
    */
    async isElementDisabledByLocator(elementLocator: Locator): Promise<boolean> {
        return elementLocator.isDisabled();
    }
    
    /**
    * Is field disabled by Selector
    * @param elementSelector
    * @param options
    */
    async isElementDisabled(elementSelector: string, options?: any): Promise<boolean> {
        if (options) {
            return this.isElementDisabledByLocator(this.page.locator(elementSelector, options));
        } else {
            return this.isElementDisabledByLocator(this.page.locator(elementSelector));
        }
    }

    /**
    * Count elements
    * @param elementSelector
    * @param options
    */
    async countElements(elementSelector: string, options?: any): Promise<number> {
        let numberOfElements: number;
        try {
            numberOfElements = await this.page.locator(elementSelector, options).count();
        } catch (e) {
            return 0;
        }
        return numberOfElements;
    }

    /**
    * Drag and drop an element
    * @param elementLocatorFrom
    * @param elementLocatorTo
    */
    async dragAndDropElementByLocator(elementLocatorFrom: Locator, elementLocatorTo: Locator): Promise<void> {
        await elementLocatorTo.scrollIntoViewIfNeeded();
        const box = (await elementLocatorTo.boundingBox());
        await elementLocatorFrom.hover();
        await this.page.mouse.down();
        // @ts-ignore: Object is possibly 'null'.
        await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await this.page.waitForTimeout(500);
        await elementLocatorTo.hover();
        await this.page.mouse.up();
        await this.page.waitForTimeout(500);
    }
 
    /**
    * Drag and drop an element
    * @param elementSelectorFrom
    * @param elementSelectorTo
    */
    async dragAndDropElement(elementSelectorFrom: string, elementSelectorTo: string): Promise<void> {
        await this.dragAndDropElementByLocator(this.page.locator(elementSelectorFrom), this.page.locator(elementSelectorTo));
    }
 
    /**
    * Click download button and wait for file downloading
    * @param {number} newTimeout default value is 2 min
    * @param {boolean} isSuccessful default value is true
    */
    async downloadEvent(newTimeout: number = 120000, isSuccessful: boolean = true): Promise<Download> {
        const downloadObject = await this.page.waitForEvent('download', {timeout: newTimeout});
        if (isSuccessful) {
            const downloadFailure = await downloadObject.failure();
            expect(downloadFailure, `Download failure detected: "${downloadFailure}"\n`).toBeNull();
        }
        return downloadObject;
    }

    /**
    * Get specific attribute from an element
    * @param elementSelector
    * @param attributeName
    * @param options
    */
    async getAttribute(elementSelector: string, attributeName: string, options?: any): Promise<string | null> {
        if (options) {
            const element: Locator = this.page.locator(elementSelector, options);
            await this.waitElementToBeAttachedByLocator(element.first());
            return element.getAttribute(attributeName);
        } else {
            return this.page.getAttribute(elementSelector, attributeName);
        }
    }

    /**
     * Get specific attribute from an element
     * @param elementLocator
     * @param newTimeout
     * @param attributeName
     */
    async getAttributeByLocator(elementLocator: Locator, attributeName: string, newTimeout: number = 1000): Promise<string | null> {
        await this.waitElementToBeAttachedByLocator(elementLocator);
        return elementLocator.getAttribute(attributeName, {timeout: newTimeout});
    }
}
