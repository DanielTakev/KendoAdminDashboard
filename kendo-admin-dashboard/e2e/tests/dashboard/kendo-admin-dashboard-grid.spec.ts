import { test, Page, expect} from '@playwright/test';
import { KendoAdminDashboardPage } from 'e2e/pages/dashboard/kendo-admin-dashboard.page';
import { ColumnNamesEnum } from 'e2e/src/enums/columns.enum';

test.describe('Kendo Admin Dashboard', async () => {

    let page: Page;
    let kendoAdminDashboardPage: KendoAdminDashboardPage;
    const testSearchPhraseByAddress: string = 'Ovcha Ku';
    const testDatafilteredByAddress: string[] = ["Boiko Borisov\tAccount Executive\t\tOffline\t\t\n51%\n\t$76,354.00\t(304) 6324519\tOvcha Kupel, Sofia"];
 
    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
        await page.goto('/KendoAdminDashboard/');
        kendoAdminDashboardPage = new KendoAdminDashboardPage(page);
    });
 
    test.afterAll(async () => {
        await page.close();
    });

    test.describe('Drag and Drop functionality', async () => {

        test.afterEach(async () => {
            await kendoAdminDashboardPage.clearAllDropTargets();
        });

        test('one dragged column reorder the grid structure', async () => {
            await kendoAdminDashboardPage.dragAndDropByColumnName(ColumnNamesEnum.JOB_TITLE);
            // Here we assume that we have a control on the test data and after reordering the result is always the same
            expect.soft(await kendoAdminDashboardPage.getReorderedGridRowsCount(), `The rows are not reordered as expected.`).toEqual(17);
            const jobTitleRowIndex = await kendoAdminDashboardPage.getReorderedGridHeaderIndex(ColumnNamesEnum.JOB_TITLE);
            expect(jobTitleRowIndex, `The actual row index is: ${jobTitleRowIndex}`).toEqual("3");
        });

        test('each additional dragged column is positioned as a child row', async () => {
            await kendoAdminDashboardPage.dragAndDropByColumnName(ColumnNamesEnum.CONTACT_NAME);
            await kendoAdminDashboardPage.dragAndDropByColumnName(ColumnNamesEnum.COUNTRY);
            await kendoAdminDashboardPage.dragAndDropByColumnName(ColumnNamesEnum.ENGAGEMENT);

            const contactNameRowIndex = await kendoAdminDashboardPage.getReorderedGridHeaderIndex(ColumnNamesEnum.CONTACT_NAME);
            expect.soft(contactNameRowIndex, `The actual row index is: ${contactNameRowIndex}`).toEqual("3");
            const countryRowIndex = await kendoAdminDashboardPage.getReorderedGridHeaderIndex(ColumnNamesEnum.COUNTRY);
            expect.soft(countryRowIndex, `The actual row index is: ${countryRowIndex}`).toEqual("4");
            const engagementRowIndex = await kendoAdminDashboardPage.getReorderedGridHeaderIndex(ColumnNamesEnum.ENGAGEMENT);
            expect(engagementRowIndex, `The actual row index is: ${engagementRowIndex}`).toEqual("5");
        });
        // TODO Add more tests for the Drag and Drop functionality
    });

    test.describe('The search bar', async () => {
        test('is able to filter unique by partial address value', async () => {
            await kendoAdminDashboardPage.setTextIntoKendoGridSearchBar(testSearchPhraseByAddress);
            expect.soft(await kendoAdminDashboardPage.hasRowValues(testDatafilteredByAddress), `The expected result is not shown into the grid.`).toBeTruthy();
            const resultsCount = await kendoAdminDashboardPage.getOnlyDataGridRowsCount();
            expect(resultsCount, `More than expected results are shown into the grid. 
                Results count: ${resultsCount}`).toEqual(1);
        });
        // TODO Add more tests for the search bar
    });
});
