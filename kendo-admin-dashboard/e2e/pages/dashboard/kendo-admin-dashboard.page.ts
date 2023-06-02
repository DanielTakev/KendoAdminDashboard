import { Locator, Page} from '@playwright/test';
import { BasePage } from '../common/base.page';
import { StringUtils } from '../utils/string.utils';

export class KendoAdminDashboardPage extends BasePage {
 
    constructor(page: Page) {
       super(page);
    }

    private readonly kendoGrid = 'kendo-grid ';
    private readonly exportToExcelButton = this.kendoGrid + '#exportToExcelId';
    private readonly exportToPdfButton = this.kendoGrid + '#exportToPdfId';
    private readonly kendoGridToolbar = 'kendo-grid-toolbar ';
    private readonly searchBar = this.kendoGridToolbar + '#inputId';
    private readonly dropTargetPanel = 'kendo-grid-group-panel';
    private readonly gridList = this.kendoGrid + 'kendo-grid-list ';
    private readonly gridRows = this.kendoGrid + 'tr.k-table-row';
    private readonly reorderedRows = '.k-reset';
    private readonly gridNoRecords = this.gridList + '.k-grid-norecords';
    private readonly removeDropTargetButton = '.k-chip-remove-action';
    private readonly kendoPager = this.kendoGrid + 'kendo-pager';
    private readonly nextPageButton = this.kendoPager + '.k-i-caret-alt-right'; 

    /**
    * Search via the Kendo search bar
    * @param {string} text
    */
    async setTextIntoKendoGridSearchBar(text: string): Promise<void> {
        await this.setInputField(this.searchBar, text);
    }

    /**
    * Clear the Kendo search bar
    */
    async clearSearchBar(): Promise<void> {
        await this.clearInputField(this.searchBar);
    }
    
    /**
    * Click Export to Excel button
    */
    async clickExportToExcelButton(): Promise<void> {
        await this.clickElement(this.exportToExcelButton);
    }

    /**
    * Click Export to PDF button
    */
    async clickExportToPdfButton(): Promise<void> {
        await this.clickElement(this.exportToPdfButton);
    }
    
    /**
    * Check if grid has any results
    */
    async isGridEmpty(): Promise<boolean> {
        return this.isElementVisibleOnPage(this.gridNoRecords, {timeout: 3000});
    }

    /**
    * Has next available page
    */
    async hasNextPage(): Promise<boolean> {
        if ((await this.isElementVisibleOnPage(this.nextPageButton)) && !(await this.isElementDisabled(this.nextPageButton))) {
            return true;
        } else {
            return false;
        }
    }

    /**
    * Click next grid page
    */
    async clickNextPage(): Promise<void> {
        if (await this.isElementVisibleOnPage(this.nextPageButton) && !(await this.isElementDisabled(this.nextPageButton))) {
            await this.clickElement(this.nextPageButton);
        }
    }

    /**
    * Get the row element from a Kendo grid
    * @param {Array<string>} rowValues
    * @param {string} rowSelector
    */
    async getGridRowElement(rowValues: Array<string>): Promise<Locator | null> {
        await this.waitElementToBeVisible(this.gridRows);
        const itemsList: Locator = this.page.locator(this.gridRows);
        const rowCount = await itemsList.count();
        if (rowCount === 0) {
           process.stdout.write('The grid does not contain any row\n');
           return null;
        }
        for (let i = 0; i < rowCount; i++) {
           const itemText = await this.getTextOfElementsByLocator(itemsList.nth(i));
           if (StringUtils.exactMatchStringsInArrays(itemText, rowValues)) {
                return itemsList.nth(i);
           }
        }
        const hasMorePages = await this.hasNextPage();
        if (hasMorePages) {
            await this.clickNextPage();
            return this.getGridRowElement(rowValues);
        } else {
            return null;
        }
     }
 
    /**
    * Check if the grid contains particular row
    * @param {Array<string>} rowValues
    */
    async hasRowValues(rowValues: Array<string>): Promise<boolean> {
        if (await this.isGridEmpty()) {
            return false;
        } else {
            const foundElement = await this.getGridRowElement(rowValues);
            return foundElement !== null;
        }
    }

    /**
    * Drag and drop a column by name
    * @param {string} columnName
    */
    async dragAndDropByColumnName(columnName: string): Promise<void> {
        const desiredColumnByName = this.page.locator("th[role='columnheader']", {hasText: columnName}).locator("a");
        const targetElement = this.page.locator(this.dropTargetPanel);
        await this.waitElementsToBeVisibleByLocator(desiredColumnByName)
        await this.dragAndDropElementByLocator(desiredColumnByName, targetElement);
    }

    /**
    * Get the reordered rows count
    */
    async getReorderedGridRowsCount(): Promise<number> {
        await this.waitElementToBeVisible(this.reorderedRows, {timeout: 2000});
        return this.countElements(this.reorderedRows);
    }

    /**
    * Teardown method for removing all dropped filters if the remove button is visible
    */
    async clearAllDropTargets(): Promise<void> {
        if (await this.isElementVisibleOnPage(this.removeDropTargetButton, {timeout: 2000})) {
            const removeTargetButtonsCount = await this.page.locator(this.removeDropTargetButton).count();
            for (let i = 0; i < removeTargetButtonsCount; i++) {
                await this.clickElement(this.removeDropTargetButton);
            }
        }
    }
}
