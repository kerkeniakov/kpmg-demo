import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();

describe('Some random webdriver.io test', () => {
    beforeEach(function () {
        allureReporter.addDescription('A test that validates registration works.', 'text');
        allureReporter.addFeature('Authentication');
    });

    it(`1. Navigate to https://webdriver.io/`, async () => {
        await browser.url('https://webdriver.io/');
    });

    it('2. Should click on Get Started', async () => {
        await $('//a[contains(text(),"Get Started")]').click();

    });

    it('3. Should click on System requirements', async () => {
        await $('//a[contains(text(),"System Requirements")]').click();
        await $('[href="http://nodejs.org"]').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('4. Should scroll to top and expand all side menus', async () => {
        await pageObjects.DemoPage.scrollToTop();
        await $$('//a[contains(@class,"menu__link ")][contains(@aria-expanded,"false")]').forEach(async (nonExpandedMenuItems) => {
            await nonExpandedMenuItems.click();
        });
    });

    it('5. Should click on community and scroll through all options', async () => {
        await $('//a[contains(text(),"Community")]').click();
        await $$('//a[contains(@class,"theme-doc-sidebar-item-link")]').forEach(async (nonExpandedMenuItems) => {
            await nonExpandedMenuItems.click();
        });
    });

    it('6. Should click on Contribute and select Create new package', async () => {
        await $('//a[contains(text(),"Contribute")]').click();
        await $('[href="#create-new-package"]').click();
    });

    it('7. Should pause for a dramatic effect! - 7 seconds', async () => {
        await browser.pause(7000);
    });
});


