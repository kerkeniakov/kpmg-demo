import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();

describe('Login with existing account', () => {
    beforeEach(function () {
        allureReporter.addDescription('A test that validates login works.', 'text');
        allureReporter.addFeature('Authentication');
    });

    it(`1. Navigate to ${process.env.BASE_URL}`, async () => {
        await pageObjects.DemoPage.navigateToMainPage();
    });

    it('2. Should login a new user and validate success', async () => {
        await pageObjects.DemoPage.login(process.env.EXISTING_ACCOUNT_NAME, process.env.EXISTING_ACCOUNT_PASSWORD);
        await $(`//a[contains(text(),"Signed In as ${process.env.EXISTING_ACCOUNT_NAME}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('3. Should log out', async () => {
        await $('//a[contains(text(),"LogOut")]').click();
    });

    it('2. Should login again', async () => {
        await pageObjects.DemoPage.login(process.env.EXISTING_ACCOUNT_NAME, process.env.EXISTING_ACCOUNT_PASSWORD);
        await $(`//a[contains(text(),"Signed In as ${process.env.EXISTING_ACCOUNT_NAME}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });


    it('3. Should pause for a dramatic effect! - 7 seconds', async () => {
        await browser.pause(7000);
    });


});


