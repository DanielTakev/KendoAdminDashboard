import { test, Page, expect} from '@playwright/test';
import { KendoAdminDashboardPage } from 'e2e/pages/dashboard/kendo-admin-dashboard.page';
import { ExcelFileSystemUtils } from 'e2e/pages/utils/excel.utils';
import { CellValue } from 'exceljs';

test.describe('Kendo Admin Dashboard - Download Functonality', async () => {

    let page: Page;
    let kendoAdminDashboardPage: KendoAdminDashboardPage;
    const downloadedPdfFileName = `Employees*.pdf`;
    const downloadedExcelFileName = `Employees*.xlsx`;
    const excelSheet1Name = 'Sheet1';
    const expectedCellValueBeforeReordering = 'Pesho';
    const columnToDragAndDrop = 'Rating';
 
    test.beforeAll(async ({browser}) => {
        page = await browser.newPage();
        await page.goto('/KendoAdminDashboard/');
        kendoAdminDashboardPage = new KendoAdminDashboardPage(page);
    });
 
    test.afterAll(async () => {
        await kendoAdminDashboardPage.clearAllDropTargets();
        await page.close();
    });

    test('successfully download PDF file', async () => {
        const [download] = await Promise.all([
            kendoAdminDashboardPage.downloadEvent(),
            kendoAdminDashboardPage.clickExportToPdfButton()
        ]);
        expect(download.suggestedFilename(), `Downloading PDF file ${download.suggestedFilename()}`).toMatch(new RegExp(downloadedPdfFileName));
    });

    test('Drag and Drop functionality updates the internal Excel file structure', async () => {
        let [download] = await Promise.all([
            kendoAdminDashboardPage.downloadEvent(),
            kendoAdminDashboardPage.clickExportToExcelButton()
        ]);
        expect.soft(download.suggestedFilename(), `Downloading Excel file ${download.suggestedFilename()}`).toMatch(new RegExp(downloadedExcelFileName));

        let workbook = await ExcelFileSystemUtils.getWorkbook(download);
        let excelA3Value: CellValue = ExcelFileSystemUtils.getValueAtCell(workbook, 3, 1, excelSheet1Name);
        // Check the A3 cell value before reordering
        expect.soft(excelA3Value as string, `Expected cell value ${expectedCellValueBeforeReordering} is not correct. 
            The actual value is: ${excelA3Value as string}`).toEqual(expectedCellValueBeforeReordering);

        await kendoAdminDashboardPage.dragAndDropByColumnName(columnToDragAndDrop);

        // Check the A3 cell value after reordering
        [download] = await Promise.all([
            kendoAdminDashboardPage.downloadEvent(),
            kendoAdminDashboardPage.clickExportToExcelButton()
        ]);
        workbook = await ExcelFileSystemUtils.getWorkbook(download);
        excelA3Value = ExcelFileSystemUtils.getValueAtCell(workbook, 3, 1, excelSheet1Name);
        expect(excelA3Value as string, `Expected cell value ${columnToDragAndDrop} is not correct. 
            The actual value is: ${excelA3Value as string}`).toEqual(columnToDragAndDrop + ": 1");
    });
});
