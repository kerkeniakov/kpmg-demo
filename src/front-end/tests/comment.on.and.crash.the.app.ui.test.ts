import { TESTS_TIMEOUT_MAX } from '../constants/testconstants';
import { DataProvider } from '../data-providers/Data.provider';
import { PageObjects } from '../pageobjects/Page.objects.provider';
import allureReporter from '@wdio/allure-reporter';

const pageObjects = new PageObjects();
const dataProviders = new DataProvider();

describe('Should comment on post and click [CRASH THE APP]', () => {
    beforeEach(function () {
        allureReporter.addDescription('Simulated Error', 'text');
        allureReporter.addFeature('comments');
        allureReporter.addFeature('posts');
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

    it('7. Should simulate an application error -> will Click crash the app and expect something non existant', async () => {
        await $('//a[contains(text(),"LogOut")]').click();
        await $('//a[contains(text(),"Crash the application")]').click();
        await $('.ednorog').waitForDisplayed({ timeout: TESTS_TIMEOUT_MAX });
    });

});


