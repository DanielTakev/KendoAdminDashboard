import { test as base } from '@playwright/test';
import { BasePage } from '@e2ePages/common/base.page';
import { KendoAdminDashboardPage } from '@e2ePages/dashboard/kendo-admin-dashboard.page';
import { ColumnNamesEnum } from '@e2eEnums/columns.enum'

export type TestStepsPages = {
    basePage: BasePage | undefined;
    kendoAdminDashboardPage: KendoAdminDashboardPage | undefined
};

type MyFixtures = {
   pages: Partial<TestStepsPages>;
   columnNamesEnum: typeof ColumnNamesEnum
}

export const test = base.extend<MyFixtures & { pages: Partial<TestStepsPages> }>({
   pages: async ({ page }, use) => {
      await use({
         basePage: new BasePage(page),
         kendoAdminDashboardPage: new KendoAdminDashboardPage(page)
      })
   },
   columnNamesEnum: ColumnNamesEnum
});

export { expect, Page } from '@playwright/test';