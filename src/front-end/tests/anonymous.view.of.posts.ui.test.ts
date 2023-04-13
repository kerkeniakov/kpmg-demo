import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();
const dataProviders = new DataProvider();

describe('Should comment on post', () => {
    beforeEach(function () {
        allureReporter.addDescription('A test that validates commenting module.', 'text');
        allureReporter.addFeature('Commenting');
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

    it('5. Should enter the created post and post a comment', async () => {
        await $(`//img[contains(@src,"${dataProviders.PostsDataProvider.postsTestData[0].imageUrl}")]//following::a`).click();
        await $('//strong[contains(text(),"Add Comment")]').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
        await $('//strong[contains(text(),"Add Comment")]').click();

        await $('[name="comment[text]"]').setValue('random-comment');
        await $('[type="submit"]').click();
    });

    it('6. Should count all the delete buttons of the comments', async () => {
        const allDeleteButtons = await $$('//button[contains(text(),"Delete")]').length;
        await expect(allDeleteButtons).toBe(2);
    });

    it('7. Should log out, click Home, and select SHOW POSTS', async () => {
        await $('//a[contains(text(),"LogOut")]').click();
        await $('//a[contains(text(),"Home")]').click();
        await $('//a[contains(text(),"SHOW POSTS")]').click();
    });

    it('8. Should enter the created post anoymously', async () => {
        await $(`//img[contains(@src,"${dataProviders.PostsDataProvider.postsTestData[0].imageUrl}")]//following::a`).click();
    });

    it('7. Should pause for a dramatic effect! - 7 seconds', async () => {
        await browser.pause(7000);
    });

});


