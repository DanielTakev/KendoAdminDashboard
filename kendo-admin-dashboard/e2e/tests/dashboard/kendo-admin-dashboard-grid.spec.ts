import { test, expect } from "@e2ePages/common/prerequisites-setup";

test.describe('Kendo Admin Dashboard', async () => {

    test.beforeEach(async ({page}) => {
        await page.goto('/KendoAdminDashboard');
    });

    const testSearchPhraseByAddress: string = 'Ovcha Ku';
    const testDatafilteredByAddress: string[] = ["Boiko Borisov\tAccount Executive\t\tOffline\t\t\n51%\n\t$76,354.00\t(304) 6324519\tOvcha Kupel, Sofia"];

    test.describe('Drag and Drop functionality', async () => {

        test.afterEach(async ({pages}) => {
            await pages.kendoAdminDashboardPage.clearAllDropTargets();
        });

        test('one dragged column reorder the grid structure', async ({pages, columnNamesEnum}) => {
            //await page.goto('/KendoAdminDashboard');
            await pages.kendoAdminDashboardPage.dragAndDropByColumnName(columnNamesEnum.JOB_TITLE);
            // Here we assume that we have a control on the test data and after reordering the result is always the same
            expect.soft(await pages.kendoAdminDashboardPage.getReorderedGridRowsCount(), `The rows are not reordered as expected.`).toEqual(17);
            const jobTitleRowIndex = await pages.kendoAdminDashboardPage.getReorderedGridHeaderIndex(columnNamesEnum.JOB_TITLE);
            expect(jobTitleRowIndex, `The actual row index is: ${jobTitleRowIndex}`).toEqual("3");
        });

        test('each additional dragged column is positioned as a child row', async ({pages, columnNamesEnum}) => {
            await pages.kendoAdminDashboardPage.dragAndDropByColumnName(columnNamesEnum.CONTACT_NAME);
            await pages.kendoAdminDashboardPage.dragAndDropByColumnName(columnNamesEnum.COUNTRY);
            await pages.kendoAdminDashboardPage.dragAndDropByColumnName(columnNamesEnum.ENGAGEMENT);

            const contactNameRowIndex = await pages.kendoAdminDashboardPage.getReorderedGridHeaderIndex(columnNamesEnum.CONTACT_NAME);
            expect.soft(contactNameRowIndex, `The actual row index is: ${contactNameRowIndex}`).toEqual("3");
            const countryRowIndex = await pages.kendoAdminDashboardPage.getReorderedGridHeaderIndex(columnNamesEnum.COUNTRY);
            expect.soft(countryRowIndex, `The actual row index is: ${countryRowIndex}`).toEqual("4");
            const engagementRowIndex = await pages.kendoAdminDashboardPage.getReorderedGridHeaderIndex(columnNamesEnum.ENGAGEMENT);
            expect(engagementRowIndex, `The actual row index is: ${engagementRowIndex}`).toEqual("5");
        });
        // TODO Add more tests for the Drag and Drop functionality
    });

    test.describe('The search bar', async () => {
        test('is able to filter unique by partial address value', async ({pages}) => {
            await pages.kendoAdminDashboardPage.setTextIntoKendoGridSearchBar(testSearchPhraseByAddress);
            expect.soft(await pages.kendoAdminDashboardPage.hasRowValues(testDatafilteredByAddress), `The expected result is not shown into the grid.`).toBeTruthy();
            const resultsCount = await pages.kendoAdminDashboardPage.getOnlyDataGridRowsCount();
            expect(resultsCount, `More than expected results are shown into the grid. 
                Results count: ${resultsCount}`).toEqual(1);
        });
        // TODO Add more tests for the search bar
    });
});
