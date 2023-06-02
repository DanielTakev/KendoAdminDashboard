# KendoAdminDashboard

* Created admin dashboard grid with Kendo components. 
* Added E2E tests suite with sample tests and test reports. The reports are only available on local execution (the folders are `git ignored`).
- Technologies: TypeScript, HTML, CSS and Playwright for E2E testing

To start the local server run: 
* `ng serve` command

To start the E2E tests against production:
* `npx playwright test` into the `e2e` folder

To start the E2E tests against the local server:
* run the server and update the playwright.config.ts file from `baseURL: 'https://danieltakev.github.io'` to `baseURL: 'http://localhost:4200'`
