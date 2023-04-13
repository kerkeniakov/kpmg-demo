import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();
const dataProviders = new DataProvider();

describe('Registering a new account', () => {
    beforeEach(function () {
        allureReporter.addDescription('A test that validates registration works.', 'text');
        allureReporter.addFeature('Authentication');
        allureReporter.addFeature('Registration');
    });

    it(`1. Navigate to ${process.env.BASE_URL}`, async () => {
        await pageObjects.DemoPage.navigateToMainPage();
    });

    it('2. Should register a new user and validate success', async () => {
        await pageObjects.DemoPage.registerNewAccount(dataProviders.UsersDataProvider.userTestData[0].userName, dataProviders.UsersDataProvider.userTestData[0].password);
        await $(`//a[contains(text(),"Signed In as ${dataProviders.UsersDataProvider.userTestData[0].userName}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('3. Should log out', async () => {
        await $('//a[contains(text(),"LogOut")]').click();
    });

    it('4. Should register a new user and validate success', async () => {
        await pageObjects.DemoPage.registerNewAccount(dataProviders.UsersDataProvider.userTestData[1].userName, dataProviders.UsersDataProvider.userTestData[1].password);
        await $(`//a[contains(text(),"Signed In as ${dataProviders.UsersDataProvider.userTestData[1].userName}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('5. Should log out', async () => {
        await $('//a[contains(text(),"LogOut")]').click();
    });

    it('6. Should register a new user and validate success', async () => {
        await pageObjects.DemoPage.registerNewAccount(dataProviders.UsersDataProvider.userTestData[2].userName, dataProviders.UsersDataProvider.userTestData[2].password);
        await $(`//a[contains(text(),"Signed In as ${dataProviders.UsersDataProvider.userTestData[2].userName}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

});


