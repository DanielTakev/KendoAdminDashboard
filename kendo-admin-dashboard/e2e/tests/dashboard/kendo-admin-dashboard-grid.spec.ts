import { test, Page, expect} from '@playwright/test';
import { KendoAdminDashboardPage } from 'e2e/pages/dashboard/kendo-admin-dashboard.page';
import { ExcelFileSystemUtils } from 'e2e/pages/utils/excel.utils';
import { CellValue } from 'exceljs';

test.describe('Kendo Admin Dashboard', async () => {

    let page: Page;
    let kendoAdminDashboardPage: KendoAdminDashboardPage;
    const testSearchPhraseByAddress: string = '3 Paget Co';
    const testDatafilteredByAddress: string[] = ["Garey Malecky\tAccount Executive\t\tOffline\t\t\n51%\n\t$76,354.00\t(304) 6324519\t3 Paget Court"];
    const columnToDragAndDrop = 'Job Title';
 
    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
        await page.goto('/KendoAdminDashboard/');
        kendoAdminDashboardPage = new KendoAdminDashboardPage(page);
    });
 
    test.afterAll(async () => {
        await page.close();
    });

    test.describe('Drag and Drop functionality', async () => {

        test('reorder the grid structure', async () => {
            await kendoAdminDashboardPage.dragAndDropByColumnName(columnToDragAndDrop);
            // Here we assume that we have a control on the test data and after reordering the result is always the same
            expect(await kendoAdminDashboardPage.getReorderedGridRowsCount()).toEqual(17);
            await kendoAdminDashboardPage.clearAllDropTargets();
        });
        // TODO Add more tests for the Drag and Drop functionality
    });

    test.describe('The search bar', async () => {
        test('is able to filter by partial address value', async () => {
            await kendoAdminDashboardPage.setTextIntoKendoGridSearchBar(testSearchPhraseByAddress);
            expect(await kendoAdminDashboardPage.hasRowValues(testDatafilteredByAddress)).toBeTruthy();
        });
        // TODO Add more tests for the search bar
    });
});
