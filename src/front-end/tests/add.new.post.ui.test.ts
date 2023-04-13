import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();
const dataProviders = new DataProvider();

describe('Adding new posts', () => {
    beforeEach(function () {
        allureReporter.addDescription('A test that posts work.', 'text');
        allureReporter.addFeature('Posts');
    });

    it(`1. Navigate to ${process.env.BASE_URL}`, async () => {
        await pageObjects.DemoPage.navigateToMainPage();
    });

    it('2. Should register a new user and validate success', async () => {
        await pageObjects.DemoPage.registerNewAccount(dataProviders.UsersDataProvider.userTestData[0].userName, dataProviders.UsersDataProvider.userTestData[0].password);
        await $(`//a[contains(text(),"Signed In as ${dataProviders.UsersDataProvider.userTestData[0].userName}")]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('3. Should create a new post', async () => {
        await $('//a[contains(text(),"Add a new post")]').click();
        await pageObjects.DemoPage.populateNewPost(dataProviders.PostsDataProvider.postsTestData[0]);
        await $('[type="submit"]').click();
    });

    it('4. Should validate post is created', async () => {
        await $(`[src="${dataProviders.PostsDataProvider.postsTestData[0].imageUrl}"]`).waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

    it('5. Should pause for a dramatic effect! - 10 seconds', async () => {
        await browser.pause(10000);
    });
});


